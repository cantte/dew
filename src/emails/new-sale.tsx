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
  total: number
  products: number
  date: Date
  url: string
  store: string
}

export const NewSaleCustomerEmail = ({
  name,
  total,
  products,
  date,
  url,
  store,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Nueva venta registrada</Preview>
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
              Señor(a) {name}, hemos registrado una nueva compra en nuestro
              sistema en la tienda {store}.
            </Text>

            <Container>
              <Text>
                Has compadro un total de{' '}
                {Intl.NumberFormat('es-CO').format(products || 0)}
                {products === 1 ? ' producto' : ' productos'}. El total de tu
                compra es de{' '}
                {Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(total || 0)}
                .
              </Text>
              <Text>
                Puedes ver el detalle de tu compra dando clic en el siguiente
                enlace:
              </Text>

              <Container className="flex justify-center">
                <Button
                  className="rounded-md bg-[#690dab] px-4 py-2 text-center font-medium text-sm text-white"
                  href={url}
                >
                  Ver detalle de la compra
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
