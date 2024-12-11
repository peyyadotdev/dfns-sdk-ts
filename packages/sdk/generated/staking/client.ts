import { DfnsApiClientOptions } from '../../types/generic'
import { simpleFetch } from '../../utils/fetch'
import { userActionFetch } from '../../utils/userActionFetch'
import { buildPathAndQuery } from '../../utils/url'
import * as T from './types'

export class StakingClient {
  constructor(private apiOptions: DfnsApiClientOptions) {}

  async createStake(request: T.CreateStakeRequest): Promise<T.CreateStakeResponse> {
    const path = buildPathAndQuery('/staking/stakes', {
      path: request ?? {},
      query: {},
    })

    const response = await userActionFetch(path, {
      method: 'POST',
      body: request.body,
      apiOptions: this.apiOptions,
    })

    return response.json()
  }

  async listStakes(request?: T.ListStakesRequest): Promise<T.ListStakesResponse> {
    const path = buildPathAndQuery('/staking/stakes', {
      path: request ?? {},
      query: request?.query ?? {},
    })

    const response = await simpleFetch(path, {
      method: 'GET',
      apiOptions: this.apiOptions,
    })

    return response.json()
  }
}
