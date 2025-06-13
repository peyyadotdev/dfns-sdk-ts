import { WebAuthnSigner } from '@dfns/sdk-browser'
import { DfnsApiClient } from '@dfns/sdk'

export const getWebauthnSigner = () => {
  return new WebAuthnSigner({
    relyingParty: {
      id: process.env.REACT_APP_PASSKEYS_RELYING_PARTY_ID!,
      name: process.env.REACT_APP_PASSKEYS_RELYING_PARTY_NAME!,
    },
  })
}

export const dfnsApi = (authToken: string | undefined): DfnsApiClient => {
  return new DfnsApiClient({
    orgId: process.env.REACT_APP_DFNS_ORG_ID!,
    authToken: authToken,
    baseUrl: process.env.REACT_APP_DFNS_API_URL!,
    signer: getWebauthnSigner(),
  })
}
