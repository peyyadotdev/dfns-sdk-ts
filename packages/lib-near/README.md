# Dfns Wallet for [NEAR Protocol](https://near.org/)

Dfns wallet integration with [near-api-js](https://docs.near.org/tools/near-api), makes working with NEAR as simple and painless as possible.

The `DfnsWallet` uses `generateSignature` to compute signatures using your Dfns managed wallets, for all the transactions created by your program. Then you need to broadcast these transactions yourself to the corresponding node providers that are either self hosted or by a blockchain provider.

A typical setup routine looks like this,

```typescript
import { DfnsWallet } from '@dfns/lib-near'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'

const signer = new AsymmetricKeySigner({
  privateKey: process.env.DFNS_PRIVATE_KEY!,
  credId: process.env.DFNS_CRED_ID!,
})

const dfnsClient = new DfnsApiClient({
  orgId: process.env.DFNS_ORG_ID!,
  authToken: process.env.DFNS_AUTH_TOKEN!,
  baseUrl: process.env.DFNS_API_URL!,
  signer,
})

return DfnsWallet.init({
  walletId: process.env.DFNS_WALLET_ID!,
  dfnsClient,
})
```

Go checkout the [examples](../../examples/libs/near) we have that showcase how you can start developing dapps with Dfns wallets.
