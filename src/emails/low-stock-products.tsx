import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  lowStockProducts: RouterOutputs['inventory']['lowStock']
  storeName: string
  url: string
}

export const LowStockProducsEmail = ({
  lowStockProducts,
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
              Estos productos tienen poco stock en la tienda {storeName}.
            </Text>

            {lowStockProducts?.map((product) => (
              <Section
                key={product.id}
                className="my-2 rounded border border-[#eaeaea] border-solid p-2"
              >
                <Row>
                  <Column className="m-0 flex items-center space-x-1 p-0">
                    <Text className="m-0 mr-2 p-0 font-bold text-base">
                      {product.name}
                    </Text>
                    <Text className="m-0 rounded border border-[#eaeaea] border-solid p-0.5 text-neutral-500 text-xs">
                      {product.code}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Text className="m-0 p-0 text-neutral-500 text-xs">
                    Stock: {product.stock}
                  </Text>
                </Row>
                <Row>
                  <Text className="m-0 p-0 text-neutral-500 text-xs">
                    Cantidad: {product.quantity}
                  </Text>
                </Row>
              </Section>
            ))}

            <Container className="flex justify-center">
              <Button
                className="rounded-md bg-[#690dab] px-4 py-2 text-center font-medium text-sm text-white"
                href={url}
              >
                Ver productos
              </Button>
            </Container>

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

export default LowStockProducsEmail
