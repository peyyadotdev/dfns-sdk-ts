import { DfnsWallet } from '@dfns/lib-sui'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'

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
    walletId: walletId,
    dfnsClient,
  })
}

async function main() {
  const wallet = await initDfnsWallet(process.env.SUI_WALLET_ID!)
  console.log('Sui wallet address: %s', wallet.address)

  const client = new SuiClient({ url: process.env.SUI_RPC_URL! })

  // Amount in MIST (1 SUI = 1,000,000,000 MIST)
  const amount = 1000000 // 0.001 SUI
  const recipient = '0xae98475c63cfebc918b57193a4183f4374f67974971aff9034699793d331d7de'

  console.log(`preparing transfer: amount = ${amount / 1000000000} SUI, recipient = ${recipient}`)

  const tx = new Transaction()
  const [coin] = tx.splitCoins(tx.gas, [amount])
  tx.transferObjects([coin], recipient)
  tx.setSender(wallet.address)

  // Build transaction to get bytes
  await tx.build({ client })
 
  // Sign with Dfns wallet
  const signedTx = await tx.sign({signer: wallet})
  
  console.log('transaction signed')

  // Submit transaction
  const result = await client.executeTransactionBlock({
    transactionBlock: signedTx.bytes,
    signature: signedTx.signature,
  })

  console.log(`transaction broadcasted: hash = ${result.digest}`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
