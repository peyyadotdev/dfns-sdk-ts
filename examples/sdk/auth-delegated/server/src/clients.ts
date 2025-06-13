import { DfnsApiClient, DfnsDelegatedApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'

export const apiClient = (orgId: string, authToken?: string) => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID!,
    privateKey: process.env.DFNS_PRIVATE_KEY!,
  })

  return new DfnsApiClient({
    orgId,
    authToken: authToken ?? process.env.DFNS_AUTH_TOKEN!,
    baseUrl: process.env.DFNS_API_URL!,
    signer,
  })
}

export const delegatedClient = (orgId: string, authToken: string) => {
  return new DfnsDelegatedApiClient({
    orgId,
    authToken,
    baseUrl: process.env.DFNS_API_URL!,
  })
}
