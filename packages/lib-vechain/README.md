# Dfns Wallet for [Vechain SDK](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk)

Dfns wallet integration with [Vechain SDK](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk).

The `DfnsWallet` uses `generateSignature` to compute signatures using your Dfns managed wallets. Then you need to broadcast these transactions yourself to the corresponding node providers that are either self hosted or by a blockchain provider.

A typical setup routine looks like this,

```typescript
import { DfnsWallet } from '@dfns/lib-vechain'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { Address } from '@vechain/sdk-core'
import { ThorClient, VeChainProvider } from '@vechain/sdk-network'

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

```

Go checkout the [examples](../../examples/libs/vechain) we have that showcase how you can start developing dapps with Dfns wallets.
