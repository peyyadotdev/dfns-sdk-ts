# Basic Kadena transfer

Demonstrates a very simple Kadena transfer from a Dfns wallet to another account. The transfer target doesn't need to be a Dfns wallet.

## Prerequisites

You need a `Service Account`. To create a new `Service Account`, first [generate a keypair](https://docs.dfns.co/dfns-docs/advanced-topics/authentication/credentials/generate-a-key-pair), then go to `Dfns Dashboard` > `Settings` > `Org Settings` > `Service Accounts` > `New Service Account`, and enter the following information,

- Name, choose any name
- Public Key, the public key from the step 'generate a keypair'

After the `Service Account` is created, make sure you copy the account's `authToken`. You won't be able to access the token after you navigate away from the confirmation page.

Go back to the service accounts listing, and the new `Service Account` should be listed there. copy the `Signing Key Cred ID`, e.g. `Y2ktM3E5Y2MtbXFoM20tODdiOW1jNDZqZ2gxYWJqbA`.

Copy `.env.example` to a new file `.env` and set the following values,

- `DFNS_API_URL` = `https://api.dfns.ninja`
- `DFNS_ORG_ID` = Dfns Organisation ID (grab it in Dfns Dashboard: `Profile` > `Account`)
- `DFNS_CRED_ID` = the `Signing Key Cred ID` from above
- `DFNS_PRIVATE_KEY` = the private key from the step 'generate a keypair', the newlines should not be a problem
- `DFNS_AUTH_TOKEN` = the `authToken` from above, the value should start with `eyJ0...`
- `KADENA_WALLET_ID` = a Dfns Kadena [wallet](https://docs.dfns.co/dfns-docs/api-docs/beta-wallets-api-and-nfts/create-wallet) ID
- `KADENA_NODE_URL` = a Kadena node URL (`https://api.testnet.chainweb.com` for testnet)

**note** _The Kadena wallet must have testnet KDA to transfer and pay for gas._

## Explanation

In order to run the program, you would need a Dfns [Kadena testnet wallet](https://explorer.chainweb.com/testnet/account/k:your-public-key). The program will transfer 1 Hopp to another account.

```shell
> ts-node main.ts

Kadena wallet address: k:a7f89d20372594dd833819a67eb26b4df33c5dded2e6d1fe28ae780b80803e83
transferring 1 Hopp from wallet k:a7f89d20372594dd833819a67eb26b4df33c5dded2e6d1fe28ae780b80803e83 to k:b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f25e5f92444cde
network: testnet04, chain: 0
creating transfer command...
signing command...
command signed
transaction submitted: LlxxH6MPMqknCLHIw2wzF4iyulYcv1IKtxJEZWDxL7M
```

This is the Kadena testnet [transaction](https://explorer.chainweb.com/testnet/tx/LlxxH6MPMqknCLHIw2wzF4iyulYcv1IKtxJEZWDxL7M).