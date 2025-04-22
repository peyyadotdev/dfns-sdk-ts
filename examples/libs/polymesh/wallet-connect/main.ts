import { DfnsApiClient } from '@dfns/sdk'
import { DfnsWallet } from '@dfns/lib-polymesh'
import { SignClient } from '@walletconnect/sign-client'
import { Core } from '@walletconnect/core'
import { ErrorResponse, formatJsonRpcError, formatJsonRpcResult } from '@walletconnect/jsonrpc-utils'
import * as dotenv from 'dotenv'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polymeshassociation/signing-manager-types'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { Polymesh } from '@polymeshassociation/polymesh-sdk'
import { Registry } from '@polkadot/types/types'

dotenv.config()
interface SignerResponse {
  signature: string
}

const handleMessageSigning = async (
  raw: SignerPayloadRaw,
  dfnsWallet: DfnsWallet
): Promise<SignerResponse> => {
  console.log(`#### Message request received #### \n\n ${JSON.stringify(raw, null, 2)} \n`)

  const approved = await promptUserForApproval('Do you want to sign this message? (y/n)')
  if (!approved) {
    console.log('User rejected the message signing request')
    throw new UserRejectionError('User rejected the message signing request')
  }

  const result = await dfnsWallet.signRaw(raw)
  console.log(`message signed by DFNS`)

  return { signature: result.signature }
}

const handleTransactionSigning = async (
  payload: SignerPayloadJSON,
  dfnsWallet: DfnsWallet
): Promise<SignerResponse> => {
  console.log(`#### Transaction request received #### \n\n ${JSON.stringify(payload, null, 2)} \n`)

  const approved = await promptUserForApproval('Do you want to sign this transaction? (y/n)')
  if (!approved) {
    console.log('User rejected the transaction signing request')
    throw new UserRejectionError('User rejected the transaction signing request')
  }

  const result = await dfnsWallet.signPayload(payload)
  console.log(`transaction signed by DFNS`)

  return { signature: result.signature }
}

const promptUserForApproval = async (message: string): Promise<boolean> => {
  console.log(message)
  const userInput = await new Promise<string>((resolve) => {
    process.stdin.once('data', (buf) => resolve(buf.toString().trim()))
  })
  return userInput.toLowerCase() === 'y'
}

const initDfnsWallet = async (walletId: string, registry: Registry) => {
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
    registry
  })
}
interface SessionRequest {
    method: string
    params: any
    expiryTimestamp?: number
}

(async () => {
  const client = await Polymesh.connect({
    nodeUrl: process.env.POLYMESH_NODE_URL!,
    polkadot: { noInitWarn: true },
  })

  const dfnsWallet = await initDfnsWallet(
    process.env.POLYMESH_WALLET_ID!,
    client._polkadotApi.registry
  )

  const signClient = await SignClient.init({
    core: new Core({ projectId: 'f8442d3590ae69e39f6d717e7c89d9fd' }),
    metadata: {
      name: 'PolymeshTestnet',
      description: 'WalletConnect Local Wallet for Polkadot',
      url: 'https://reown.com/appkit',
      icons: ["https://assets.reown.com/reown-profile-pic.png"],
    },
  })

  console.log('Paste your WalletConnect URI:')
  process.stdin.once('data', async (buf) => {
    const uri = buf.toString().trim()
    await signClient.core.pairing.pair({ uri })
  })

  // Accept the Wallet connection
  signClient.on('session_proposal', async (proposal) => {
    const address = dfnsWallet.address

    const response = {
      state: {
        accounts: [`polkadot:2ace05e703aa50b48c0ccccfc8b424f7:${address}`],
      },
      namespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: ['polkadot:2ace05e703aa50b48c0ccccfc8b424f7'],
          events: ['chainChanged', 'accountsChanged'],
          accounts: [`polkadot:2ace05e703aa50b48c0ccccfc8b424f7:${address}`],
        },
      },
    }

   const { topic } = await signClient.approve({
      id: proposal.id,
      ...response,
    })

    console.log('Connected to WalletConnect session:', topic)
  })

  // Disconnect from WalletConnect session
  signClient.on('session_delete', async (event) => {
    const { topic } = event
    console.log(`Disconnected from WalletConnect session: ${topic}`)
    process.exit(0)
  })

  // Handle session requests
  signClient.on('session_request', async (event) => {
    const { topic, params, id } = event
    const { request } = params
  
    try {
      const responseData = await handleSessionRequest(request, dfnsWallet)
      await signClient.respond({
        topic,
        response: formatJsonRpcResult(id, responseData)
      })
    } catch (error: any) {   
      console.log(`Error handling request: ${error.message}`)   
      await signClient.respond({
        topic,
        response: formatJsonRpcError(id, await formatError(error))
      })
    }
  })
})()

// Handle all wallet connect methods for Polkadot
async function handleSessionRequest(request: SessionRequest, dfnsWallet: DfnsWallet) {
  switch (request.method) {
    case 'polkadot_signMessage': {
      const raw = request.params as SignerPayloadRaw
      return handleMessageSigning(raw, dfnsWallet)
    }

    case 'polkadot_signTransaction': {
      const payload = request.params.transactionPayload as SignerPayloadJSON
      return handleTransactionSigning(payload, dfnsWallet)
    }

    default:
      throw new MethodNotSupportedError(request.method)
  }
}

class WalletConnectError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'WalletConnectError'
    this.code = code
  }
}

class UserRejectionError extends WalletConnectError {
  constructor(message: string) {
    super(message, 4001)
    this.name = 'UserRejectionError'
  }
}

class MethodNotSupportedError extends WalletConnectError {
  constructor(method: string) {
    super(`Method ${method} not supported`, -32601)
    this.name = 'MethodNotSupportedError'
  }
}

function formatError(error: any): ErrorResponse {
  if (error instanceof WalletConnectError) {
    return { code: error.code, message: error.message }
  } 

  return { code: -32603, message: error.message ?? 'Internal error'}
}
