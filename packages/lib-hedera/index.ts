import { DfnsApiClient, DfnsError } from '@dfns/sdk'
import { GenerateSignatureResponse } from '@dfns/sdk/types/wallets'
import {
  AccountId,
  PublicKey,
  Transaction,
  Signer,
  Provider,
  LocalProvider,
  LedgerId,
  Executable,
  SignerSignature,
  AccountBalance,
  AccountBalanceQuery,
  AccountInfo,
  AccountInfoQuery,
  TransactionRecord,
  TransactionId,
  AccountRecordsQuery,
  Client
} from '@hashgraph/sdk'

export const hexToBuffer = (hex: string): Buffer => {
  return Buffer.from(stripHexPrefix(hex), 'hex')
}

const stripHexPrefix = (hex: string): string => {
  return hex.replace(/^0x/, '')
}

export type DfnsWalletOptions = {
  walletId: string
  dfnsClient: DfnsApiClient
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
  } else if (!response.signature || !response.signature.encoded) {
    throw new DfnsError(-1, 'signature missing', response)
  }
}

export class DfnsWallet implements Signer {
  private readonly dfnsClient: DfnsApiClient
  private readonly walletId: string

  private constructor(
    dfnsOptions: DfnsWalletOptions,
    private readonly provider: LocalProvider,
    private readonly publicKey: PublicKey,
    private readonly accountId: AccountId
  ) {
    this.dfnsClient = dfnsOptions.dfnsClient
    this.walletId = dfnsOptions.walletId
  }

  public static async init(options: DfnsWalletOptions): Promise<DfnsWallet> {
    const { walletId, dfnsClient } = options
    const res = await dfnsClient.wallets.getWallet({ walletId })

    if (res.status !== 'Active') {
      throw new DfnsError(-1, 'wallet not active', { walletId, status: res.status })
    }

    if (res.network !== 'Hedera' && res.network !== 'HederaTestnet') {
      throw new DfnsError(-1, 'wallet is not bound to a Hedera network', {
        walletId,
        network: res.network,
      })
    }

    const nativeAddressRegex = /^0\.0\.\d+$/
    if (!nativeAddressRegex.test(res.address!)) {
      throw new DfnsError(-1, 'account must be created. Address is not in native Hedera format (0.0.x)', {
        walletId,
        address: res.address!
      })
    }

    const accountId = AccountId.fromString(res.address!)

    if (!res.signingKey?.publicKey) {
      throw new DfnsError(-1, 'wallet public key not found', { walletId })
    }

    const publicKey = PublicKey.fromString(res.signingKey.publicKey)

    const client = res.network === 'HederaTestnet'
      ? Client.forTestnet()
      : Client.forMainnet()

    return new DfnsWallet(options, new LocalProvider({ client }), publicKey, accountId)
  }

  public async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
    if (!transaction.isFrozen()) {
      transaction.freeze()
    }

    const transactionBytes = transaction.toBytes()
    const messageHex = '0x' + Buffer.from(transactionBytes).toString('hex')

    const response = await this.dfnsClient.wallets.generateSignature({
      walletId: this.walletId,
      body: {
        kind: 'Transaction',
        transaction: messageHex,
      },
    })

    assertSignResponseSuccessful(response)

    const signature = response.signature
    if (!signature?.encoded) {
      throw new DfnsError(-1, 'signature encoded value missing', response)
    }

    if (!response.signedData) {
      throw new DfnsError(-1, 'signed data missing', response)
    }

    const signedTx = Transaction.fromBytes(new Uint8Array(hexToBuffer(response.signedData)))

    transaction.addSignature(this.getAccountKey(), signedTx.getSignatures())

    return transaction
  }

  getProvider(): Provider {
    return this.provider
  }

  public getLedgerId(): LedgerId | null {
    return this.provider.getLedgerId()
  }

  public getAccountId(): AccountId {
    return this.accountId
  }

  public getNetwork(): { [key: string]: string | AccountId } {
    return this.provider.getNetwork()
  }

  public getMirrorNetwork(): string[] {
    return this.provider.getMirrorNetwork()
  }

  public getAccountKey(): PublicKey {
    return this.publicKey
  }

  public getAccountBalance(): Promise<AccountBalance> {
    return this.call(
      new AccountBalanceQuery().setAccountId(this.accountId)
    )
  }

  public getAccountInfo(): Promise<AccountInfo> {
    return this.call(new AccountInfoQuery().setAccountId(this.accountId))
  }

  public getAccountRecords(): Promise<TransactionRecord[]> {
    return this.call(
      new AccountRecordsQuery().setAccountId(this.accountId)
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public sign(_messages: Uint8Array[]): Promise<SignerSignature[]> {
    throw new DfnsError(-1, 'sign method not implemented', {})
  }

  public async checkTransaction<T extends Transaction>(transaction: T): Promise<T> {
    const transactionId = transaction.transactionId

    if (transactionId?.accountId && transactionId.accountId.compare(this.accountId) !== 0) {
      throw new DfnsError(-1, "transaction's ID constructed with a different account ID", {
        transactionAccountId: transactionId.accountId.toString(),
        walletAccountId: this.accountId.toString(),
      })
    }

    if (!this.provider) {
      return transaction
    }

    const nodeAccountIds = (transaction.nodeAccountIds ?? []).map((nodeAccountId) => 
      nodeAccountId.toString()
    )
    
    const network = Object.values(this.provider.getNetwork()).map((nodeAccountId) =>
      nodeAccountId.toString()
    )

    const allNodeIdsInNetwork = nodeAccountIds.every((nodeId) => network.includes(nodeId))

    if (!allNodeIdsInNetwork) {
      throw new DfnsError(-1, 'Transaction already set node account IDs to values not within the current network', {
        transactionNodeIds: nodeAccountIds,
        networkNodeIds: network,
      })
    }

    return transaction
  }

  public async populateTransaction<T extends Transaction>(transaction: T): Promise<T> {
    const accountId = this.getAccountId()
    transaction._freezeWithAccountId(accountId)

    if (transaction.transactionId == null) {
      transaction.setTransactionId(
        TransactionId.generate(accountId)
      )
    }

    if (
      transaction.nodeAccountIds != null &&
      transaction.nodeAccountIds.length != 0
    ) {
      return Promise.resolve(transaction.freeze())
    }

    if (this.provider == null) {
      return Promise.resolve(transaction)
    }

    const nodeAccountIds = Object.values(this.provider.getNetwork()).map(
      (id) => (typeof id === "string" ? AccountId.fromString(id) : id)
    )

    transaction.setNodeAccountIds(
      [nodeAccountIds[0]]
    )

    return Promise.resolve(transaction.freeze())
  }

  public call<RequestT, ResponseT, OutputT>(
    request: Executable<RequestT, ResponseT, OutputT>
  ): Promise<OutputT> {
    return this.provider.call(request)
  }

  public close(): void {
    this.provider.close()
  }
}