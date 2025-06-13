import { DfnsWallet } from '@dfns/lib-iota'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { IotaClient } from '@iota/iota-sdk/client'
import { Transaction } from '@iota/iota-sdk/transactions'

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
  const wallet = await initDfnsWallet(process.env.IOTA_WALLET_ID!)
  console.log('Iota wallet address: %s', wallet.address)

  const client = new IotaClient({ url: process.env.IOTA_RPC_URL! })

  // Amount in the minimum decimal
  const amount = 1
  const recipient = '0xae98475c63cfebc918b57193a4183f4374f67974971aff9034699793d331d7de'

  console.log(`preparing transfer: amount = ${amount}, recipient = ${recipient}`)

  const tx = new Transaction()
  const [coin] = tx.splitCoins(tx.gas, [amount])

  tx.transferObjects([coin], recipient)

  const res = await client.signAndExecuteTransaction({ transaction: tx, signer: wallet })

  console.log(`transaction broadcasted: hash = ${res.digest}`)
}

main()
