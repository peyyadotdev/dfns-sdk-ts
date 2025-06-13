import { WebAuthnSigner } from '@dfns/sdk-browser'
import { DfnsApiClient, DfnsAuthenticator } from '@dfns/sdk'

export const getWebauthnSigner = () => {
  return new WebAuthnSigner({
    relyingParty: {
      id: process.env.REACT_APP_PASSKEYS_RELYING_PARTY_ID!,
      name: process.env.REACT_APP_PASSKEYS_RELYING_PARTY_NAME!,
    },
  })
}

export const authApi = (): DfnsAuthenticator => {
  return new DfnsAuthenticator({
    orgId: process.env.REACT_APP_DFNS_ORG_ID!,
    baseUrl: process.env.REACT_APP_DFNS_API_URL!,
    signer: getWebauthnSigner(),
  })
}

export const dfnsApi = (): DfnsApiClient => {
  return new DfnsApiClient({
    orgId: process.env.REACT_APP_DFNS_ORG_ID!,
    authToken: localStorage.getItem('DFNS_AUTH_TOKEN') ?? undefined,
    baseUrl: process.env.REACT_APP_DFNS_API_URL!,
    signer: getWebauthnSigner(),
  })
}
