import { BaseAuthApi } from '@dfns/sdk'
import { Request, Response } from 'express'

import { apiClient } from '../clients'

export const registerInit = async (req: Request, res: Response) => {
  // You can perform the registration flow of your system before starting the
  // Dfns delegated registration.
  const { username } = req.body

  const client = apiClient(process.env.DFNS_ORG_ID!)
  const challenge = await client.auth.createDelegatedRegistrationChallenge({
    body: { kind: 'EndUser', email: username },
  })

  console.debug(challenge)

  res.json(challenge)
}

export const registerComplete = async (req: Request, res: Response) => {
  const { signedChallenge, temporaryAuthenticationToken } = req.body
  const registration = await BaseAuthApi.createUserRegistration(signedChallenge, {
    orgId: process.env.DFNS_ORG_ID!,
    baseUrl: process.env.DFNS_API_URL!,
    authToken: temporaryAuthenticationToken,
  })

  console.debug(registration)

  res.json(registration)
}
