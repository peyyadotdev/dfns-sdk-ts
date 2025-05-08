import { BaseAuthApi, SignUserActionChallengeRequest, UserActionChallengeResponse } from '../../baseAuthApi'
import { DfnsDelegatedApiClientOptions } from '../../dfnsDelegatedApiClient'
import { simpleFetch } from '../../utils/fetch'
import { buildPathAndQuery } from '../../utils/url'
import * as T from './types'

export class DelegatedNetworksClient {
  constructor(private apiOptions: DfnsDelegatedApiClientOptions) {}

  async createCantonValidatorInit(request: T.CreateCantonValidatorRequest): Promise<UserActionChallengeResponse> {
    const path = buildPathAndQuery('/networks/:network/validators', {
      path: request ?? {},
      query: {},
    })

    const challenge = await BaseAuthApi.createUserActionChallenge(
      {
        userActionHttpMethod: 'POST',
        userActionHttpPath: path,
        userActionPayload: JSON.stringify(request.body),
        userActionServerKind: 'Api',
      },
      this.apiOptions
    )

    return challenge
  }

  async createCantonValidatorComplete(
    request: T.CreateCantonValidatorRequest,
    signedChallenge: SignUserActionChallengeRequest
  ): Promise<T.CreateCantonValidatorResponse> {
    const path = buildPathAndQuery('/networks/:network/validators', {
      path: request ?? {},
      query: {},
    })

    const { userAction } = await BaseAuthApi.signUserActionChallenge(
      signedChallenge,
      this.apiOptions
    )

    const response = await simpleFetch(path, {
      method: 'POST',
      body: request.body,
      headers: { 'x-dfns-useraction': userAction },
      apiOptions: this.apiOptions,
    })

    return response.json()
  }

  async getFees(request?: T.GetFeesRequest): Promise<T.GetFeesResponse> {
    const path = buildPathAndQuery('/networks/fees', {
      path: request ?? {},
      query: request?.query ?? {},
    })

    const response = await simpleFetch(path, {
      method: 'GET',
      apiOptions: this.apiOptions,
    })

    return response.json()
  }

  async listCantonValidators(request: T.ListCantonValidatorsRequest): Promise<T.ListCantonValidatorsResponse> {
    const path = buildPathAndQuery('/networks/:network/validators', {
      path: request ?? {},
      query: request.query ?? {},
    })

    const response = await simpleFetch(path, {
      method: 'GET',
      apiOptions: this.apiOptions,
    })

    return response.json()
  }

  async readContract(request: T.ReadContractRequest): Promise<T.ReadContractResponse> {
    const path = buildPathAndQuery('/networks/read-contract', {
      path: request ?? {},
      query: {},
    })

    const response = await simpleFetch(path, {
      method: 'POST',
      body: request.body,
      apiOptions: this.apiOptions,
    })

    return response.json()
  }
}
