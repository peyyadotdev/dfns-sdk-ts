import { DfnsWallet } from '@dfns/lib-viem'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { createEcdsaKernelAccountClient } from '@zerodev/presets/zerodev'
import dotenv from 'dotenv'
import { createPublicClient, getContract, http, parseAbi, parseEther } from 'viem'
import { toAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

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

  const kernelClient = await createEcdsaKernelAccountClient({
    chain: sepolia,
    projectId: process.env.ZERODEV_PROJECT_ID!,
    signer: toAccount(ethWallet),
    paymaster: 'SPONSOR',
  })

  const address = await kernelClient.account.address
  console.log('Smart account address:', address)

  const publicClient = createPublicClient({
    transport: http(process.env.ETHEREUM_NODE_URL!),
  })

  // an erc20 token on sepolia testnet that anyone can mint
  const token = getContract({
    address: '0x9aF64fA0B11FB3603f7A8E9D29D2f2FA62Bb51BB',
    abi: parseAbi(['function mint(address to, uint256 amount)']),
    client: {
      public: publicClient,
      wallet: kernelClient,
    },
  })

  // send a sponsored user operation to mint some tokens
  const txHash = await token.write.mint([address, parseEther('1')])
  console.log(`Transaction hash: ${txHash}`)
}

main()
