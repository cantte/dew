import { EmployeeStoreInvitationEmail } from '~/emails/employee-store-invitation'
import resend from '~/server/email/resend'

type Params = {
  name: string
  email: string
  storeName: string
  invitationLink: string
}

export const sendEmployeeInvitationLink = async ({
  name,
  email,
  storeName,
  invitationLink,
}: Params) => {
  return await resend.emails.send({
    from: process.env.RESEND_EMAIL!,
    to: email,
    subject: `Has sido invitado a unirte a ${storeName}`,
    react: EmployeeStoreInvitationEmail({
      employeeName: name,
      storeName,
      url: invitationLink,
    }),
  })
}
