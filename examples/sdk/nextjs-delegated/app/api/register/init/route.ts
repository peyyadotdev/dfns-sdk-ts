import { NextResponse } from 'next/server'

import { apiClient } from '../../clients'

export const POST = async (req: Request) => {
  // You can perform the registration flow of your system before starting the
  // Dfns delegated registration.
  const { username } = await req.json()

  const client = apiClient()
  const challenge = await client.auth.createDelegatedRegistrationChallenge({
    body: { kind: 'EndUser', email: username },
  })

  console.debug(challenge)

  return NextResponse.json(challenge)
}
