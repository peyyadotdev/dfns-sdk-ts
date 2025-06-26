
import { GenericPolymeshTransaction, TransactionStatus } from '@polymeshassociation/polymesh-sdk/types'
import { BigNumber, Polymesh } from '@polymeshassociation/polymesh-sdk'

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))
  
export const awaitMiddlewareSynced = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
tx: GenericPolymeshTransaction<any, any>,
sdk: Polymesh,
retries = 15,
delay = 2000
): Promise<void> => {
if (![TransactionStatus.Succeeded, TransactionStatus.Failed].includes(tx.status)) {
    throw new Error('Transaction was not successful or failed and does not have a block number')
}


const txBlock = tx.blockNumber as BigNumber

for (let i = 0; i < retries; i++) {
    try {
    const latestBlock = await sdk.network.getLatestBlock()

    if (latestBlock && latestBlock.gte(txBlock)) {
        return
    }
    } catch (err) {
    throw new Error(`Error checking middleware sync status: ${err}`)
    }

    if (i === retries - 1) {
    throw new Error(`Middleware has not synced after ${retries} attempts`)
    }

    await sleep(delay)
}
}
