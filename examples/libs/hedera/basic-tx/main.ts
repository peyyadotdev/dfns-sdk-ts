import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { DfnsWallet } from '@dfns/lib-hedera'
import { Hbar, TransferTransaction } from '@hashgraph/sdk'

import * as dotenv from 'dotenv'

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
  const hederaWalletId = process.env.HEDERA_WALLET_ID!

  const senderWallet = await initDfnsWallet(hederaWalletId)
  console.log('Hedera wallet account ID: %s', senderWallet.getAccountId().toString())

  const amount = Hbar.fromTinybars(1)
  const recipient = '0x956fbb0c88b3c597d4afdbab3e26939051ff6725'
  console.log(`transferring ${amount.toString()} from wallet ${senderWallet.getAccountId().toString()} to ${recipient}`)

  console.log('creating transfer transaction...')
  const txTransfer = await new TransferTransaction()
    .addHbarTransfer(recipient, Hbar.fromTinybars(1))
    .addHbarTransfer(senderWallet.getAccountId(), Hbar.fromTinybars(-1))
    .freezeWithSigner(senderWallet)

  console.log('signing and executing transfer transaction...')
  const signedTx = await txTransfer.signWithSigner(senderWallet)
  const executed = await signedTx.executeWithSigner(senderWallet)

  console.log(`transaction executed. txId: ${executed.transactionId.toString()}`)
  senderWallet.close()
}

main()
