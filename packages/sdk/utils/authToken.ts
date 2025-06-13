import { fromBase64 } from './base64'

export const JWT_CUSTOM_DATA_CLAIM = 'https://custom/app_metadata'

export const assertAuthTokenIsSameOrg = ({ authToken, orgId }: { authToken: string; orgId: string }) => {
  const tokenBody = authToken.split('.')?.[1] || ''
  let decoded: any

  try {
    decoded = JSON.parse(fromBase64(tokenBody).toString('utf-8'))
  } catch (error) {
    throw new Error('Provided auth token could not be properly parsed')
  }

  const tokenOrgId = decoded?.[JWT_CUSTOM_DATA_CLAIM]?.['orgId']

  if (tokenOrgId !== orgId) {
    throw new Error(`Provided auth token is not scoped to org ID ${orgId}`)
  }
}
