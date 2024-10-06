export const generateEmployeeInvitationLink = (invitationToken: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL
    ? process.env.NEXT_PUBLIC_URL
    : 'http://localhost:3000'

  return `${baseUrl}/invite/${invitationToken}`
}
