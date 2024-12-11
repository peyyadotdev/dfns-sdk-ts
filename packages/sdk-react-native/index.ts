import {
  CredentialSigner,
  CredentialStore,
  DfnsError,
  Fido2Assertion,
  Fido2Attestation,
  UserActionChallenge,
  UserRegistrationChallenge,
} from '@dfns/sdk'
import { toBase64Url } from '@dfns/sdk/utils'
import { Platform } from 'react-native'
import { Passkey, PasskeyAuthenticationResult } from 'react-native-passkey'
import { PasskeyAuthenticationRequest, PasskeyRegistrationRequest } from 'react-native-passkey/lib/typescript/Passkey'

export const DEFAULT_WAIT_TIMEOUT = 60000

const b64StandardToUrlSafe = (standard: string): string => {
  return standard.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const b64UrlSafeToStandard = (urlSafe: string): string => {
  return (urlSafe + '==='.slice((urlSafe.length + 3) % 4)).replace(/-/g, '+').replace(/_/g, '/')
}

interface PasskeysSignerConf {
  /**
   * The relying party identifies your application to users, when users create/use passkeys. (Read more [here](https://www.w3.org/TR/webauthn-2/#relying-party)).
   * - id: The relying party identifier is a valid domain string identifying the WebAuthn Relying Party.
   * In other words, its the domain your application is running on, which will be tied to the passkeys that users create.
   * We advise to use the root domain, not the full domain (eg `acme.com`, not `app.acme.com` nor `foo.app.acme.com`), that way, passkeys created
   * by your users can be re-used on other subdomains (eg. on `foo.acme.com` and `bar.acme.com`) in the future. Read more [here](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions#rp).
   * - name: A string representing the name of the relying party (e.g. "Acme"). This is the name the user will be presented with when creating or validating a WebAuthn operation.
   */
  relyingParty: { id: string; name: string }
  /**
   * Timeout to use for navigotor.credentials calls. That's the time after which if user did not successfully
   * select and use his passkey, an error will be thrown by webauthn client. Read more [here](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions#timeout).
   * */
  timeout?: number
}

// react-native-passkey is incorrect encoding the credId with standard base64 for
// some reason. we have to undo that.
class AndroidPasskeys implements CredentialSigner<Fido2Assertion>, CredentialStore<Fido2Attestation> {
  constructor(private conf: PasskeysSignerConf) {
    if (!this.conf?.relyingParty?.id || !this.conf?.relyingParty?.name) {
      throw new DfnsError(-1, `Relying party ID and name must be specified in the WebauthnSigner initializer`)
    }
  }

  async sign(challenge: UserActionChallenge): Promise<Fido2Assertion> {
    const request: PasskeyAuthenticationRequest = {
      challenge: challenge.challenge,
      allowCredentials: challenge.allowCredentials.webauthn,
      rpId: this.conf.relyingParty.id,
      userVerification: challenge.userVerification,
      timeout: this.conf.timeout ?? DEFAULT_WAIT_TIMEOUT,
    }

    const credential: PasskeyAuthenticationResult = await Passkey.authenticate(request)

    return {
      kind: 'Fido2',
      credentialAssertion: {
        credId: b64StandardToUrlSafe(credential.id),
        clientData: credential.response.clientDataJSON,
        authenticatorData: credential.response.authenticatorData,
        signature: credential.response.signature,
        userHandle: credential.response.userHandle,
      },
    }
  }

  async create(challenge: UserRegistrationChallenge): Promise<Fido2Attestation> {
    const request: PasskeyRegistrationRequest = {
      challenge: challenge.challenge,
      pubKeyCredParams: challenge.pubKeyCredParams,
      rp: this.conf.relyingParty,
      user: {
        displayName: challenge.user.displayName,
        id: toBase64Url(challenge.user.id),
        name: challenge.user.name,
      },
      attestation: challenge.attestation,
      excludeCredentials: challenge.excludeCredentials?.map((v) => ({
        id: v.id,
        type: v.type,
      })),
      authenticatorSelection: challenge.authenticatorSelection,
      timeout: this.conf.timeout ?? DEFAULT_WAIT_TIMEOUT,
    }

    const result = await Passkey.register(request)

    return {
      credentialKind: 'Fido2',
      credentialInfo: {
        credId: b64StandardToUrlSafe(result.id),
        attestationData: result.response.attestationObject,
        clientData: result.response.clientDataJSON,
      },
    }
  }
}

// react-native-passkey's iOS implementation is not WebAuthn spec compliant. all values
// are standard base64 encoded instead of base64url encoded. we have to convert the
// encoding in both directions.
class iOSPasskeys implements CredentialSigner<Fido2Assertion>, CredentialStore<Fido2Attestation> {
  constructor(private conf: PasskeysSignerConf) {
    if (!this.conf?.relyingParty?.id || !this.conf?.relyingParty?.name) {
      throw new DfnsError(-1, `Relying party ID and name must be specified in the WebauthnSigner initializer`)
    }
  }

  async sign(challenge: UserActionChallenge): Promise<Fido2Assertion> {
    const request: PasskeyAuthenticationRequest = {
      challenge: b64UrlSafeToStandard(challenge.challenge),
      allowCredentials: challenge.allowCredentials.webauthn.map(({ id, type }) => ({
        id: b64UrlSafeToStandard(id),
        type,
      })),
      rpId: this.conf.relyingParty.id,
      userVerification: 'preferred',
      timeout: this.conf.timeout ?? DEFAULT_WAIT_TIMEOUT,
    }

    const credential: PasskeyAuthenticationResult = await Passkey.authenticate(request)

    return {
      kind: 'Fido2',
      credentialAssertion: {
        credId: b64StandardToUrlSafe(credential.id),
        clientData: b64StandardToUrlSafe(credential.response.clientDataJSON),
        authenticatorData: b64StandardToUrlSafe(credential.response.authenticatorData),
        signature: b64StandardToUrlSafe(credential.response.signature),
        userHandle: b64StandardToUrlSafe(credential.response.userHandle),
      },
    }
  }

  async create(challenge: UserRegistrationChallenge): Promise<Fido2Attestation> {
    const request: PasskeyRegistrationRequest = {
      challenge: b64UrlSafeToStandard(challenge.challenge),
      pubKeyCredParams: challenge.pubKeyCredParams,
      rp: this.conf.relyingParty,
      user: {
        displayName: challenge.user.displayName,
        id: toBase64Url(challenge.user.id),
        name: challenge.user.name,
      },
      attestation: challenge.attestation,
      excludeCredentials: challenge.excludeCredentials.map(({ id, type }) => ({
        id: b64UrlSafeToStandard(id),
        type,
      })),
      authenticatorSelection: challenge.authenticatorSelection,
      timeout: this.conf.timeout ?? DEFAULT_WAIT_TIMEOUT,
    }

    const result = await Passkey.register(request)

    return {
      credentialKind: 'Fido2',
      credentialInfo: {
        credId: b64StandardToUrlSafe(result.id),
        attestationData: b64StandardToUrlSafe(result.response.attestationObject),
        clientData: b64StandardToUrlSafe(result.response.clientDataJSON),
      },
    }
  }
}

export class PasskeysSigner implements CredentialSigner<Fido2Assertion>, CredentialStore<Fido2Attestation> {
  private platform: CredentialSigner<Fido2Assertion> & CredentialStore<Fido2Attestation>

  constructor(conf: PasskeysSignerConf) {
    switch (Platform.OS) {
      case 'android':
        this.platform = new AndroidPasskeys(conf)
        break
      case 'ios':
        this.platform = new iOSPasskeys(conf)
        break
      default:
        throw new DfnsError(-1, `${Platform.OS} is not supported`)
    }
  }

  async sign(challenge: UserActionChallenge): Promise<Fido2Assertion> {
    return this.platform.sign(challenge)
  }

  async create(challenge: UserRegistrationChallenge): Promise<Fido2Attestation> {
    return this.platform.create(challenge)
  }
}
