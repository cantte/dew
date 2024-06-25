import {
  Coins,
  LineChart,
  ShoppingBasket,
  ShoppingCart,
  Store,
  UserRound,
} from 'lucide-react'
import React from 'react'
import MotionOnView from '~/components/motion-on-view'

const FeaturesSection = () => {
  return (
    <section id="features" className="flex max-w-7xl flex-col space-y-8">
      <MotionOnView>
        <h2 className="text-center text-5xl font-semibold">
          Características destacadas
        </h2>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <Store className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Visualiza tus <span className="text-primary-text">tiendas</span>{' '}
              de forma intuitiva
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Explora y gestiona todas tus tiendas con una interfaz intuitiva y
              fácil de usar. Mantén un control completo y eficiente de tus
              múltiples ubicaciones desde una sola plataforma centralizada.
              Optimiza la gestión de inventario, supervisa las ventas y analiza
              el desempeño de cada tienda con total comodidad y claridad.
            </p>
          </div>
        </div>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <ShoppingBasket className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Gestiona tu inventario de{' '}
              <span className="text-primary-text">productos</span> con precisión
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Obtén un control detallado y preciso de todos tus productos y su
              inventario con nuestra potente herramienta de administración.
              Desde la creación hasta la actualización y seguimiento, mantén tus
              productos organizados y fácilmente accesibles. Optimiza tus
              operaciones comerciales al monitorear el inventario en tiempo
              real, recibir notificaciones de agotamiento y realizar ajustes
              estratégicos para maximizar la eficiencia y la rentabilidad.
            </p>
          </div>
        </div>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <ShoppingCart className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Potencia tus <span className="text-primary-text">ventas</span> con
              un seguimiento inteligente
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Optimiza tus estrategias de venta con nuestro completo sistema de
              seguimiento de ventas. Desde el punto de venta hasta el análisis
              de datos, mantén un control preciso de cada transacción. Conoce en
              tiempo real el rendimiento de tus ventas, identifica tendencias y
              ajusta tu enfoque para maximizar tus ingresos. Con herramientas
              analíticas avanzadas, toma decisiones informadas y aumenta la
              rentabilidad de tu negocio de manera significativa.
            </p>
          </div>
        </div>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <UserRound className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Registra a tus <span className="text-primary-text">clientes</span>{' '}
              una vez
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Centraliza el registro de clientes con nuestra función de registro
              global. Olvídate de los registros duplicados y el trabajo manual
              repetitivo. Con nuestro sistema, los clientes se registran una vez
              y su información está disponible globalmente. Esto te permite
              acceder a perfiles completos en cualquier punto de contacto, desde
              la primera interacción hasta el seguimiento posterior a la venta.
              Simplifica la gestión de clientes y ofrece un servicio
              personalizado y coherente en todo momento.
            </p>
          </div>
        </div>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <Coins className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Gestiona tus transacciones con nuestra{' '}
              <span className="text-primary-text">caja registradora</span>
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Optimiza el flujo de efectivo de tu negocio con nuestra completa
              caja registradora digital. Registra de manera eficiente cada
              transacción, desde las ventas hasta los gastos, con total
              precisión y seguridad. Nuestra caja registradora te permite llevar
              un control detallado de tus ingresos y egresos, simplificando la
              contabilidad y brindándote una visión clara de la salud financiera
              de tu negocio. Con funciones avanzadas de informes y análisis,
              toma decisiones informadas para impulsar el crecimiento y la
              rentabilidad de tu empresa.
            </p>
          </div>
        </div>
      </MotionOnView>

      <MotionOnView>
        <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <span className="rounded-full bg-primary p-3">
            <LineChart className="h-8 w-8 text-primary-foreground" />
          </span>

          <div className="flex flex-col space-y-2">
            <h4 className="text-3xl">
              Análisis profundo con nuestros{' '}
              <span className="text-primary-text">reportes</span>
            </h4>

            <p className="text-base leading-7 text-muted-foreground">
              Desbloquea información valiosa sobre el rendimiento de tu negocio
              con nuestros reportes personalizados. Más allá de simplemente
              generar datos, nuestra herramienta de análisis te ofrece una
              visión profunda de tus ventas y productos. Obtén insights
              detallados sobre tendencias de ventas, comportamiento del cliente
              y desempeño del inventario para tomar decisiones estratégicas
              informadas. Con reportes intuitivos y fáciles de entender,
              aprovecha al máximo tu información para impulsar el crecimiento y
              la rentabilidad de tu empresa.
            </p>
          </div>
        </div>
      </MotionOnView>
    </section>
  )
}

export default FeaturesSection
