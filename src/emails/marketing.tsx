import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export const MarketingEmail = () => {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        />
      </Head>
      <Preview>
        Simplifica tu negocio con Dew: ¡6 meses de prueba gratis!
      </Preview>
      <Tailwind>
        <Body
          style={{
            backgroundColor: 'white',
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <Container className="mx-auto max-w-2xl p-8">
            <Heading className="my-8 text-center font-bold text-3xl text-gray-800">
              Revoluciona tu facturación y punto de venta
            </Heading>
            <Text className="mb-4 text-base text-gray-700">
              Estimado emprendedor,
            </Text>
            <Text className="mb-6 text-base text-gray-700">
              ¿Estás buscando una solución simple y eficiente para gestionar tu
              negocio? Te presentamos Dew, la aplicación de facturación y POS
              que transformará la forma en que manejas tus ventas e inventario.
            </Text>
            <Section
              className="mb-8 rounded-lg p-6"
              style={{ backgroundColor: '#f3e8fa' }}
            >
              <Text className="mb-4 font-semibold text-gray-800 text-lg">
                Con Dew obtendrás:
              </Text>
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                <li>Una interfaz de usuario intuitiva y fácil de usar</li>
                <li>Reportes mensuales y anuales de ventas automatizados</li>
                <li>
                  Alertas de inventario bajo para nunca quedarte sin stock
                </li>
                <li>Facturación electrónica integrada</li>
              </ul>
            </Section>
            <Section
              className="mb-8 rounded-lg p-6 text-center"
              style={{ backgroundColor: '#f3e8fa' }}
            >
              <Text
                className="mb-4 font-bold text-xl"
                style={{ color: '#690dab' }}
              >
                ¡Únete a nuestra beta pública y disfruta de 6 meses de prueba
                gratuita!
              </Text>
              <Text className="mb-6 text-base text-gray-700">
                Además, al registrarte ahora, obtendrás un descuento especial en
                tu futura suscripción.
              </Text>
              <Button
                href="https://dew.cantte.com/"
                className="block rounded-lg px-6 py-3 text-center font-bold text-white transition duration-300 hover:opacity-90"
                style={{ backgroundColor: '#690dab' }}
              >
                Comenzar prueba gratuita
              </Button>
            </Section>
            <Hr className="my-6 border-gray-300" />
            <Text className="text-center text-gray-500 text-sm">
              © 2024 Dew. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default MarketingEmail
