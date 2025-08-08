import { NextRequest, NextResponse } from 'next/server'
import { getDfnsDelegatedClient } from '../../utils'
import { RecoveryKeyAssertion } from '@dfns/sdk'
import { RecoverBody } from '@dfns/sdk/generated/auth'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    tempAuthToken: string
    newCredentials: RecoverBody['newCredentials']
    signedRecoveryPackage: RecoveryKeyAssertion
  }

  // Complete end-user recovery
  const delegatedClient = await getDfnsDelegatedClient(body.tempAuthToken)
  const result = await delegatedClient.auth.recover({
    body: {
      newCredentials: body.newCredentials,
      recovery: body.signedRecoveryPackage,
    },
  })

  const response = NextResponse.json(result)
  return response
}
