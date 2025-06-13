import { DfnsApiClient, DfnsDelegatedApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'

export const apiClient = (authToken?: string) => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID!,
    privateKey: process.env.DFNS_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  })

  return new DfnsApiClient({
    orgId: process.env.DFNS_ORG_ID!,
    authToken: authToken ?? process.env.DFNS_AUTH_TOKEN!,
    baseUrl: process.env.DFNS_API_URL!,
    signer,
  })
}

export const delegatedClient = (authToken: string) => {
  return new DfnsDelegatedApiClient({
    orgId: process.env.DFNS_ORG_ID!,
    authToken,
    baseUrl: process.env.DFNS_API_URL!,
  })
}
