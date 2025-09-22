import { DfnsWallet } from '@dfns/lib-vechain'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { Address } from '@vechain/sdk-core'
import { ThorClient, VeChainProvider } from '@vechain/sdk-network'
import dotenv from 'dotenv'

dotenv.config()

const initDfnsWallet = async () => {
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

  const thorClient = ThorClient.at(process.env.VECHAIN_NODE_URL!)
  const provider = new VeChainProvider(thorClient)

  return DfnsWallet.init({
    walletId: process.env.VECHAIN_WALLET_ID!,
    dfnsClient,
  },
    provider)
}

const main = async () => {
  const wallet = await initDfnsWallet()
  console.log(`Vechain address: ${wallet.address}`)
  const thorClient = ThorClient.at(process.env.VECHAIN_NODE_URL!)

  const before = await thorClient.accounts.getAccount(Address.of(wallet.address))
  console.log(`Pre balance: ${BigInt(before.balance)}`)
  console.log(`Pre energy: ${BigInt(before.energy)}`)

  // Converts 1 VET to VTHO
  // Solidity: function convertForEnergy(uint256 _minReturn) public payable
  const vthoContract = '0x0000000000000000000000000000456E65726779'
  const convertForEnergyABI = [{
    constant: false,
    inputs: [{ name: '_minReturn', type: 'uint256' }],
    name: 'convertForEnergy',
    outputs: [{ name: '', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  }] as const

  const contract = thorClient.contracts.load(
    vthoContract,
    convertForEnergyABI
  );
  const convertTx = await (await contract.transact.convertForEnergy(1000000000000000000n)).wait()


  console.log(`Transaction signer: ${convertTx?.gasPayer}`)
  console.log(`Transaction txid: ${convertTx?.meta.txID}`)

  const after = await thorClient.accounts.getAccount(Address.of(wallet.address))
  console.log(`Post balance: ${BigInt(after.balance)}`)
  console.log(`Post energy: ${BigInt(after.energy)}`)

}

main()
