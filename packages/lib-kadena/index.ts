import { DfnsApiClient, DfnsError } from '@dfns/sdk'
import { GetWalletResponse, GenerateSignatureResponse } from '@dfns/sdk/types/wallets'
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/types'
import { addSignatures } from '@kadena/client'

import { Decimal } from 'decimal.js'

export type DfnsWalletOptions = {
  walletId: string
  dfnsClient: DfnsApiClient
}

const KADENA_KDA_DECIMALS = 12

const HOPP_MULTIPLIER = new Decimal(10).pow(KADENA_KDA_DECIMALS)

export const toHopp = (value: string): string => {
  const kdaValue = new Decimal(value)
  return kdaValue.mul(HOPP_MULTIPLIER).toFixed(0)
}

export const toKda = (value: string): string => {
  const hoppValue = new Decimal(value)
  return hoppValue.div(HOPP_MULTIPLIER).toFixed()
}

const stripHexPrefix = (hex: string): string => {
  return hex.replace(/^0x/, '')
}

const assertSigned = (res: GenerateSignatureResponse) => {
  if (res.status === 'Failed') {
    throw new DfnsError(-1, 'signing failed', res)
  } else if (res.status !== 'Signed') {
    throw new DfnsError(
      -1,
      'cannot complete signing synchronously because this wallet action requires policy approval',
      res
    )
  }
}

export class DfnsWallet {
  public readonly publicKey: string
  private readonly dfnsClient: DfnsApiClient

  private constructor(private readonly metadata: GetWalletResponse, options: DfnsWalletOptions) {
    this.dfnsClient = options.dfnsClient
  }

  public static async init(options: DfnsWalletOptions) {
    const { walletId, dfnsClient } = options
    const res = await dfnsClient.wallets.getWallet({ walletId })

    if (res.status !== 'Active') {
      throw new DfnsError(-1, 'wallet not active', { walletId, status: res.status })
    }

    if (!res.signingKey?.publicKey) {
      throw new DfnsError(-1, 'wallet public key not found', { walletId })
    }

    if (!res.network?.startsWith('Kadena')) {
      throw new DfnsError(-1, 'wallet is not bound to a Kadena network', {
        walletId,
        network: res.network,
      })
    }

    return new DfnsWallet(res, options)
  }

  public get networkId(): string {
   return this.metadata.network!.includes('Testnet') ? 'testnet04' : 'mainnet01'
  }

  public get chainId(): ChainId {
    return (this.metadata.network!.split(':')[1] ?? '0') as ChainId
  }

  public get address(): string {
    return this.metadata.address!
  }

  public async signCommand(command: IUnsignedCommand): Promise<ICommand> {
   const res = await this.dfnsClient.wallets.generateSignature({
      walletId: this.metadata.id,
      body: {
        kind: 'PactCommand',
        command: command.cmd,
      },
    })

    assertSigned(res)
    if (!res.signature || !res.signature.encoded) {
      throw new DfnsError(-1, 'signature missing', res)
    }

    const signedTx = addSignatures(command, {
      sig: stripHexPrefix(res.signature.encoded),
      pubKey: this.metadata.signingKey!.publicKey,
    })

    return signedTx as ICommand  
  }
}
