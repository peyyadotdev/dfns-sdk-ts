import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { DfnsWallet, toKda } from '@dfns/lib-kadena'

import * as dotenv from 'dotenv'
import { createClient, Pact, readKeyset } from '@kadena/client'

dotenv.config()

const initDfnsWallet = async (walletId: string) => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID!,
    privateKey: process.env.DFNS_PRIVATE_KEY!,
  })

  const dfnsClient = new DfnsApiClient({
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
  const kadenaWalletId = process.env.KADENA_WALLET_ID!

  const senderWallet = await initDfnsWallet(kadenaWalletId)
  console.log('Kadena wallet address: %s', senderWallet.address)

  const client = createClient((options) => {
    return {
      hostUrl: `${process.env.KADENA_NODE_URL!}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`,
      requestInit: {
        // you can add headers here if needed
        //   headers: {
        //   },
      },
    }
  })

  const recipient = 'k:b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f25e5f92444cde'

  const hoppAmount = "1"
  const pactAmount = { decimal: toKda(hoppAmount).toString() }
  console.log(`transferring ${hoppAmount} Hopp from wallet ${senderWallet.address} to ${recipient}`)
  console.log(`network: ${senderWallet.networkId}, chain: ${senderWallet.chainId}`)

  // you can change the token to transfer
  const contract = 'coin'

  console.log('creating transfer command...')
  const transferCommand = Pact.builder
    .execution(
      (Pact.modules as any)[contract as 'coin']['transfer-create'](
        senderWallet.address, recipient, readKeyset('ks'), pactAmount)
    )
    .addSigner(senderWallet.address.split(':')[1], (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability(`${contract as 'coin'}.TRANSFER`, senderWallet.address, recipient, pactAmount),
    ])
    // add public key of recipient here
    .addKeyset('ks', 'keys-all', recipient.split(':')[1])
    // set the network Id for the transaction. For testnet use 'testnet04', for mainnet use 'mainnet01'
    .setNetworkId(senderWallet.networkId)
    // here we set the chainId of the chain we want to broadcast to
    .setMeta({ chainId: senderWallet.chainId, senderAccount: senderWallet.address })
    .createTransaction()
  
  
  console.log('signing command...')
  const signedCommand = await senderWallet.signCommand(transferCommand)
  
  console.log(`command signed`)

  const res = await client.submit(signedCommand)
  console.log(`transaction submitted: ${res.requestKey}`)
}

main()