import { initEccLib } from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
initEccLib(ecc)

import { networks, script, payments, crypto, Psbt, Payment } from 'bitcoinjs-lib'
import { broadcast, waitUntilUTXO } from './blockstream_utils'
import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair'
import { Taptree } from 'bitcoinjs-lib/src/types'
import { witnessStackToScriptWitness } from './witness_stack_to_script_witness'

import { LEAF_VERSION_TAPSCRIPT } from 'bitcoinjs-lib/src/payments/bip341'

import { DfnsWallet } from '@dfns/lib-bitcoinjs'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import dotenv from 'dotenv'

const ECPair: ECPairAPI = ECPairFactory(ecc)
const network = networks.testnet

const FAUCET_ADDRESS = 'tb1plaw5a9rpyezadkma95ghqmwjcmp9w0t8fyvgfx52m3hn2pqu0t8qwtzhpp'

dotenv.config()

const initDfnsWallet = async (walletId: string) => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID!,
    privateKey: process.env.DFNS_PRIVATE_KEY!,
  })

  const dfnsClient = new DfnsApiClient({
    orgId: process.env.DFNS_ORG_ID!,
    authToken: process.env.DFNS_AUTH_TOKEN!,
    baseUrl: process.env.DFNS_API_URL!,
    signer,
  })

  return DfnsWallet.init({ walletId, dfnsClient })
}

async function start() {
  const wallet = await initDfnsWallet(process.env.BITCOIN_WALLET_ID!)

  // TapTree example
  console.log(`Running "Taptree example"`)

  // Create a tap tree with two spend paths
  // One path should allow spending using secret
  // The other path should pay to another pubkey

  // Make random key for hash_lock
  const hash_lock_keypair = ECPair.makeRandom({ network })

  const secret_bytes = Buffer.from('SECRET')
  const hash = crypto.hash160(secret_bytes)
  // Construct script to pay to hash_lock_keypair if the correct preimage/secret is provided
  const hash_script_asm = `OP_HASH160 ${hash.toString('hex')} OP_EQUALVERIFY ${toXOnly(
    hash_lock_keypair.publicKey
  ).toString('hex')} OP_CHECKSIG`
  const hash_lock_script = script.fromASM(hash_script_asm)

  const p2pk_script_asm = `${toXOnly(wallet.publicKey).toString('hex')} OP_CHECKSIG`
  const p2pk_script = script.fromASM(p2pk_script_asm)

  const scriptTree: Taptree = [
    {
      output: hash_lock_script,
    },
    {
      output: p2pk_script,
    },
  ]

  const script_p2tr = payments.p2tr({
    internalPubkey: toXOnly(wallet.internalPubkey!),
    scriptTree,
    network,
  })

  const script_addr = script_p2tr.address ?? ''

  // We can spend from this address without using the script tree
  await spend_taproot_address(wallet, script_addr, script_p2tr)

  // Spend from first branch
  await spend_hash_lock_path(wallet, script_addr, scriptTree, hash_lock_keypair, secret_bytes)

  // Spend from second branch
  await spend_p2pk_path(wallet, script_addr, scriptTree)
}

async function spend_taproot_address(wallet: DfnsWallet, script_addr: string, script_p2tr: Payment) {
  console.log(`Waiting till UTXO is detected at this Address: ${script_addr}`)
  const utxos = await waitUntilUTXO(script_addr)
  console.log(`Trying the P2PK spend path with UTXO ${utxos[0].txid}:${utxos[0].vout}`)

  const key_spend_psbt = new Psbt({ network })
  key_spend_psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: { value: utxos[0].value, script: script_p2tr.output! },
    tapInternalKey: toXOnly(wallet.internalPubkey!),
    tapMerkleRoot: script_p2tr.hash,
  })
  key_spend_psbt.addOutput({
    address: FAUCET_ADDRESS,
    value: utxos[0].value - 200,
  })

  const signed_key_spend_psbt = (await wallet.SignPsbt(key_spend_psbt)).finalizeAllInputs()
  const tx = signed_key_spend_psbt.extractTransaction()
  console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`)
  const txid = await broadcast(tx.toHex())
  console.log(`Success! Txid is ${txid}`)
}

async function spend_hash_lock_path(
  wallet: DfnsWallet,
  script_addr: string,
  scriptTree: any,
  hash_lock_keypair: ECPairInterface,
  secret_bytes: Buffer
) {
  const hash_lock_redeem = {
    output: scriptTree[0].output,
    redeemVersion: LEAF_VERSION_TAPSCRIPT,
  }

  const hash_lock_p2tr = payments.p2tr({
    internalPubkey: toXOnly(wallet.internalPubkey!),
    scriptTree,
    redeem: hash_lock_redeem,
    network,
  })

  console.log(`Waiting till UTXO is detected at this Address: ${script_addr}`)
  const utxos = await waitUntilUTXO(script_addr)
  console.log(`Trying the Hash lock spend path with UTXO ${utxos[0].txid}:${utxos[0].vout}`)

  const tapLeafScript = {
    leafVersion: hash_lock_redeem.redeemVersion,
    script: hash_lock_redeem.output,
    controlBlock: hash_lock_p2tr.witness![hash_lock_p2tr.witness!.length - 1],
  }

  const psbt = new Psbt({ network })
  psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: { value: utxos[0].value, script: hash_lock_p2tr.output! },
    tapLeafScript: [tapLeafScript],
  })

  psbt.addOutput({
    address: FAUCET_ADDRESS,
    value: utxos[0].value - 200,
  })

  psbt.signInput(0, hash_lock_keypair)

  // We have to construct our witness script in a custom finalizer
  const customFinalizer = (_inputIndex: number, input: any) => {
    const scriptSolution = [input.tapScriptSig[0].signature, secret_bytes]
    const witness = scriptSolution.concat(tapLeafScript.script).concat(tapLeafScript.controlBlock)

    return {
      finalScriptWitness: witnessStackToScriptWitness(witness),
    }
  }

  psbt.finalizeInput(0, customFinalizer)

  const tx = psbt.extractTransaction()
  console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`)
  const txid = await broadcast(tx.toHex())
  console.log(`Success! Txid is ${txid}`)
}

async function spend_p2pk_path(wallet: DfnsWallet, script_addr: string, scriptTree: any) {
  const p2pk_redeem = {
    output: scriptTree[1].output,
    redeemVersion: LEAF_VERSION_TAPSCRIPT,
  }

  const p2pk_p2tr = payments.p2tr({
    internalPubkey: toXOnly(wallet.internalPubkey!),
    scriptTree,
    redeem: p2pk_redeem,
    network,
  })

  console.log(`Waiting till UTXO is detected at this Address: ${script_addr}`)
  const utxos = await waitUntilUTXO(script_addr)
  console.log(`Trying the P2PK path with UTXO ${utxos[0].txid}:${utxos[0].vout}`)

  const p2pk_psbt = new Psbt({ network })
  p2pk_psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: { value: utxos[0].value, script: p2pk_p2tr.output! },
    tapLeafScript: [
      {
        leafVersion: p2pk_redeem.redeemVersion,
        script: p2pk_redeem.output,
        controlBlock: p2pk_p2tr.witness![p2pk_p2tr.witness!.length - 1],
      },
    ],
  })

  p2pk_psbt.addOutput({
    address: FAUCET_ADDRESS,
    value: utxos[0].value - 200,
  })

  await p2pk_psbt.signInputAsync(0, wallet)
  p2pk_psbt.finalizeAllInputs()

  const tx = p2pk_psbt.extractTransaction()
  console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`)
  const txid = await broadcast(tx.toHex())
  console.log(`Success! Txid is ${txid}`)
}

start().then(() => process.exit())

function toXOnly(pubkey: Buffer): Buffer {
  return pubkey.subarray(1, 33)
}
