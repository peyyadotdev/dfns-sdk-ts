import { WebAuthnSigner } from '@dfns/sdk-browser'
import { DfnsApiClient, DfnsAuthenticator } from '@dfns/sdk'

export const passkeySigner = new WebAuthnSigner({ relyingParty: { id: 'localhost', name: 'Demo' } })

export const authApi = (): DfnsAuthenticator => {
  return new DfnsAuthenticator({
    appId: process.env.REACT_APP_DFNS_APP_ID!,
    baseUrl: process.env.REACT_APP_DFNS_API_URL!,
    signer: passkeySigner,
  })
}

export const dfnsApi = (): DfnsApiClient => {
  return new DfnsApiClient({
    appId: process.env.REACT_APP_DFNS_APP_ID!,
    authToken: localStorage.getItem('DFNS_AUTH_TOKEN') ?? undefined,
    baseUrl: process.env.REACT_APP_DFNS_API_URL!,
    signer: passkeySigner,
  })
}
