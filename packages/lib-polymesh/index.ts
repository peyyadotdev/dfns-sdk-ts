import { DfnsApiClient, DfnsError } from '@dfns/sdk'
import { HexString } from '@polkadot/util/types'
import { GenerateSignatureResponse } from '@dfns/sdk/types/wallets'
import {
  PolkadotSigner,
  SignerPayloadRaw,
  SignerPayloadJSON,
  SignerResult,
  SigningManager,
} from '@polymeshassociation/signing-manager-types'
import { Registry } from '@polkadot/types/types'

const Ss58PrefixMap: Record<string, number> = {
  ['Polymesh']: 12,
  ['PolymeshTestnet']: 42,
}

export type DfnsWalletOptions = {
  walletId: string
  dfnsClient: DfnsApiClient,
  registry: Registry,
}

const assertSignResponseSuccessful = (response: GenerateSignatureResponse) => {
  if (response.status === 'Failed') {
    throw new DfnsError(-1, 'signing failed', response)
  } else if (response.status !== 'Signed') {
    throw new DfnsError(
      -1,
      'cannot complete signing synchronously because this wallet action requires policy approval',
      response
    )
  } else if (!response.signature || !response.signature!.encoded) {
    throw new DfnsError(-1, 'signature missing', response)
  }
}

export class DfnsSigningManager implements SigningManager {
  private externalSigner: DfnsWallet
  private _ss58Format: number

  constructor(dfnsSigner: DfnsWallet) {
    this.externalSigner = dfnsSigner
    this._ss58Format = Ss58PrefixMap[dfnsSigner.network]
  }

  /**
   * Set the SS58 format in which addresses will be encoded
   */
  public setSs58Format(ss58Format: number): void {
    this._ss58Format = ss58Format
  }

  public get ss58Format(): number {
    return this._ss58Format
  }

  public async getAccounts(): Promise<string[]> {
    return [this.externalSigner.address]
  }

  /**
   * Return a signer object that uses the underlying keyring pairs to sign
   */
  public getExternalSigner(): PolkadotSigner {
    return this.externalSigner
  }
}

export class DfnsWallet implements PolkadotSigner {
  // Id we increment for each signature
  private id: number

  private readonly dfnsClient: DfnsApiClient
  private readonly walletId: string

  private constructor(
    public address: string,
    public network: string,
    options: DfnsWalletOptions,
  ) {
    this.dfnsClient = options.dfnsClient
    this.walletId = options.walletId
  }

  public static async init(options: DfnsWalletOptions) {
    const { walletId, dfnsClient } = options
    const res = await dfnsClient.wallets.getWallet({ walletId })

    if (res.status !== 'Active') {
      throw new DfnsError(-1, 'wallet not active', { walletId, status: res.status })
    }

    if (res.network !== 'Polymesh' && res.network !== 'PolymeshTestnet' ) {
      throw new DfnsError(-1, 'wallet is not bound to a Polymesh network', {
        walletId,
        network: res.network,
      })
    }

    return new DfnsWallet(res.address!, res.network, options)
  }

  public async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    const signature = await this.signMessage(raw.data, raw.address)
    return { id: ++this.id, signature: signature }
  }

  public async signPayload(signerPayload: SignerPayloadJSON): Promise<SignerResult> {
    this.validateAddress(signerPayload.address)    

    const response = await this.dfnsClient.wallets.generateSignature({
      walletId: this.walletId,
      body: { 
        kind: 'Json',
        // remove null values from the payload to avoid issues with the DFNS API
        transaction: sanitizePayload(signerPayload)
      }
    })

    assertSignResponseSuccessful(response)
    const signature = this.formatSignature(response.signature!.encoded!)

    return { id: ++this.id, signature }
  }

  private async signMessage(data: string, address: string) {
    this.validateAddress(address)

    const response = await this.dfnsClient.wallets.generateSignature({
      walletId: this.walletId,
      body: { kind: 'Message', message: data }
    })

    assertSignResponseSuccessful(response)
    return this.formatSignature(response.signature!.encoded!)
  }

  private formatSignature(signature: string): HexString {
    // Add hex prefix and append 0 byte to indicate an ed25519 signature
    return signature.replace(/^0x/, "0x00") as HexString
  }

  private validateAddress(givenAddress: string) {
    if (this.address !== givenAddress) {
      throw new DfnsError(-1, 'address does not match the wallet used to initialize DfnsWallet', {
        expectedAddress: this.address,
        givenAddress,
      })
    }
  }
}

const sanitizePayload = <T extends Record<string, any>>(payload: T): T => {
  const result = { ...payload }
  
  for (const key in result) {
    if (result[key] === null) {
      result[key] = undefined as any
    }
  }
  
  return result
}

