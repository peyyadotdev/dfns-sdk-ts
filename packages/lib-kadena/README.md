# Dfns Wallet for [Kadena](https://kadena.io/)

Dfns wallet integration with Kadena SDK (https://github.com/kadena-io/kadena.js), makes working with Kadena as simple and painless as possible. `DfnsWallet` implements methods to interact with the Kadena network using your Dfns managed wallets.

The `DfnsWallet` uses `generateSignature` to compute signatures using your Dfns managed wallets, for all the commands created by your program. Then you need to broadcast these commands yourself to the corresponding node providers that are either self hosted or by a blockchain provider.

A typical setup routine looks like this,

```typescript
import { DfnsWallet } from '@dfns/lib-kadena'
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

const kadenaWallet = await DfnsWallet.init({
  walletId: process.env.DFNS_WALLET_ID!,
  dfnsClient,
})
```

Go checkout the [examples](../../examples/libs/kadena) we have that showcase how you can start developing dapps with Dfns wallets.