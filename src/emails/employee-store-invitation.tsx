import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import { Store } from 'lucide-react'

type Props = {
  employeeName: string
  storeName: string
  url: string
}

export const EmployeeStoreInvitationEmail = ({
  employeeName,
  storeName,
  url,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Invitación a la tienda</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Text className="scroll-m-20 font-semibold text-xl tracking-tight">
              Hola {employeeName}, has sido invitado a la tienda {storeName}.
            </Text>

            <Text>
              Has sido invitado a la tienda {storeName} en Dew. Para acceder a
              la tienda, haz clic en el siguiente botón:
            </Text>

            <Container className="flex justify-center">
              <Button
                className="flex items-center justify-center rounded-md bg-[#690dab] px-6 py-3 font-medium text-base text-white"
                href={url}
              >
                <span className="flex items-center">
                  <Store className="mr-2 size-4" size={18} />
                  <span>Aceptar invitación</span>
                </span>
              </Button>
            </Container>

            <Text className="text-neutral-500 text-xs">
              Este enlace es personal e intransferible y solo puede ser usado
              por ti una vez.
            </Text>

            <Hr />

            <Text className="text-neutral-500 text-xs">
              © {new Date().getFullYear()} Dew. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
