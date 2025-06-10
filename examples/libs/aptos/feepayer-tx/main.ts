import {
  AccountAddress,
  Aptos,
  APTOS_COIN,
  AptosConfig,
  MimeType,
  Network,
  PendingTransactionResponse,
  postAptosFullNode,
} from '@aptos-labs/ts-sdk'
import { DfnsWallet, hexToBuffer } from '@dfns/lib-aptos'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'

import * as dotenv from 'dotenv'

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

  return DfnsWallet.init({
    walletId,
    dfnsClient,
  })
}

async function main() {
  const sender = await initDfnsWallet(process.env.APTOS_SENDER_WALLET_ID!)
  const feePayer = await initDfnsWallet(process.env.APTOS_FEE_PAYER_WALLET_ID!)

  // If you want to provide your own fullnode/indexer URL, you need to use `Network.CUSTOM`
  const aptosConfig = new AptosConfig({
    network: Network.TESTNET,
  })
  const client = new Aptos(aptosConfig)

  console.log('sender address: ', sender.address)
  console.log('feepayer address: ', feePayer.address)

  const [balance, feePayerBalance] = await Promise.all([
    client.account.getAccountAPTAmount({ accountAddress: sender.address }),
    client.account.getAccountAPTAmount({ accountAddress: feePayer.address }),
  ])
  console.log(`initial sender balance: ${balance}, feepayer balance: ${feePayerBalance}`)

  const tx = await client.transaction.build.simple({
    sender: sender.address,
    data: {
      function: '0x1::coin::transfer',
      typeArguments: [APTOS_COIN],
      // receiver + amount
      functionArguments: ['0x5bdc24cb9033286ffe19f436145b9e2267dd03b0fd0d422459d381a6431d39ba', '1'],
    },
    withFeePayer: true,
  })

  tx.feePayerAddress = new AccountAddress(hexToBuffer(feePayer.address))

  // sender sign
  const partial = await sender.signTransaction(tx)
  console.log(`sender signed the transaction`)

  // feePayer sign
  const signed = await feePayer.signTransaction(partial)
  console.log(`fee payer signed the transaction`)

  const { data } = await postAptosFullNode<Uint8Array, PendingTransactionResponse>({
    aptosConfig: client.config,
    body: signed.bcsToBytes(),
    path: 'transactions',
    originMethod: 'submitTransaction',
    contentType: MimeType.BCS_SIGNED_TRANSACTION,
  })

  // Wait for the transaction to be included
  await client.waitForTransaction({ transactionHash: data.hash })

  console.log(`transaction broadcasted: ${data.hash}`)

  const [finalBalance, finalFeePayerBalance] = await Promise.all([
    client.account.getAccountAPTAmount({ accountAddress: sender.address }),
    client.account.getAccountAPTAmount({ accountAddress: feePayer.address }),
  ])

  console.log(`final sender balance: ${finalBalance}, feepayer balance: ${finalFeePayerBalance}`)
}

main()
