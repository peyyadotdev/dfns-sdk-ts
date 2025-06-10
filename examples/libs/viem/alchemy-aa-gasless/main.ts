import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy'
import { LocalAccountSigner, sepolia } from '@alchemy/aa-core'
import { DfnsWallet } from '@dfns/lib-viem'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import dotenv from 'dotenv'
import { encodeFunctionData, parseAbi, parseEther } from 'viem'
import { toAccount } from 'viem/accounts'

dotenv.config()

const initDfnsWallet = (walletId: string) => {
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

const main = async () => {
  const ethWallet = await initDfnsWallet(process.env.ETHEREUM_WALLET_ID!)
  const smartAccountClient = await createModularAccountAlchemyClient({
    apiKey: process.env.ALCHEMY_API_KEY!,
    chain: sepolia,
    signer: new LocalAccountSigner(toAccount(ethWallet)),
    gasManagerConfig: {
      policyId: process.env.ALCHEMY_GAS_POLICY_ID!,
    },
  })

  const address = await smartAccountClient.getAddress()
  console.log(`Smart account address: ${address}`)

  // an erc20 token on sepolia testnet that anyone can mint
  const token = '0x9aF64fA0B11FB3603f7A8E9D29D2f2FA62Bb51BB'

  // send a sponsored user operation to mint some tokens
  const { hash: uoHash } = await smartAccountClient.sendUserOperation({
    uo: {
      target: token,
      data: encodeFunctionData({
        abi: parseAbi(['function mint(address to, uint256 amount)']),
        functionName: 'mint',
        args: [address, parseEther('1')],
      }),
    },
  })
  console.log(`User operation hash: ${uoHash}`)

  const txHash = await smartAccountClient.waitForUserOperationTransaction({ hash: uoHash })
  console.log(`Transaction hash: ${txHash}`)
}

main()
