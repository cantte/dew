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

type Props = {
  name: string
  status: string
  date: Date
  url: string
  store: string
}

export const NewOrderStatusEmail = ({
  name,
  date,
  url,
  store,
  status,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Orden actualizada</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Text className="text-xs">
              {Intl.DateTimeFormat('es-CO', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(date ?? new Date())}
            </Text>

            <Text className="scroll-m-20 font-semibold text-xl tracking-tight">
              Señor(a) {name}, tu orden ha sido actualizada.
            </Text>

            <Text className="scroll-m-20 font-semibold text-xl tracking-tight">
              Estado de la orden: {status}
            </Text>

            <Text className="scroll-m-20 font-semibold text-xl tracking-tight">
              Tienda: {store}
            </Text>

            <Container>
              <Text>
                Puedes ver el detalle de tu orden dando clic en el siguiente
                enlace:
              </Text>

              <Container className="flex justify-center">
                <Button
                  className="rounded-md bg-[#690dab] px-4 py-2 text-center font-medium text-sm text-white"
                  href={url}
                >
                  Ver detalle de la orden
                </Button>
              </Container>
            </Container>

            <Text className="text-neutral-500 text-xs">
              Gracias por tu preferencia.
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
