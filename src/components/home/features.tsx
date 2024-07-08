import {
  Check,
  Coins,
  LineChart,
  ShoppingBasket,
  ShoppingCart,
  Store,
  UserRound,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'

const FeaturesSection = () => {
  return (
    <section id="features" className="flex max-w-7xl flex-col space-y-16">
      <div className="flex w-full flex-col items-center space-y-4">
        <Badge
          className="bg-primary/10 text-primary-text hover:bg-primary/10"
          aria-label="Características"
        >
          Características
        </Badge>

        <h2 className="text-center font-medium text-4xl">
          Mira lo que puedes hacer con dew
        </h2>

        <p className="text-base text-muted-foreground leading-7">
          Explora las características clave de dew y descubre cómo nuestra
          plataforma puede ayudarte a llevar un control eficiente de tus ventas
          y operaciones comerciales. Desde la gestión de tiendas y productos
          hasta el seguimiento de ventas y la generación de reportes, dew te
          ofrece una solución completa y fácil de usar para optimizar tu
          negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <Store className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              Gestión intuitiva de tus{' '}
              <span className="text-primary-text">tiendas</span>
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Optimiza tu negocio con nuestra potente solución de gestión
            multi-tienda. Controla inventario, ventas y rendimiento desde una
            única plataforma intuitiva.
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Registro y seguimiento de productos en todas tus tiendas.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Control de empleados y asignación de roles y permisos.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <ShoppingBasket className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              Gestión de <span className="text-primary-text">inventario</span>{' '}
              inteligente
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Revoluciona tu negocio con nuestra plataforma de gestión de
            inventario multi-tienda. Centraliza el control, maximiza las ventas
            y minimiza los costos con estas características clave:
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Seguimiento en tiempo real del stock de productos en todas tus
                tiendas.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Alertas automáticas de productos con bajo stock o vencidos.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              Impulsa tus <span className="text-primary-text">ventas</span> con
              seguimiento y análisis avanzado
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Maximiza tus ingresos con nuestro sistema inteligente de seguimiento
            de ventas. Desde el punto de venta hasta el análisis predictivo,
            obtén el control total de tu negocio.
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>Visualiza el rendimiento de ventas al instante.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>Toma decisiones basadas en datos precisos.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <UserRound className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              Registro único de{' '}
              <span className="text-primary-text">clientes</span>
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Optimiza la gestión de clientes con nuestro innovador sistema de
            registro global. Elimina duplicados, ahorra tiempo y ofrece una
            experiencia personalizada en cada interacción.
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Los clientes se registran una sola vez para todas tus
                plataformas.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Reduce el trabajo manual y minimiza errores en la gestión de
                datos.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <Coins className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              Caja <span className="text-primary-text">caja registradora</span>{' '}
              digital: control total de tus finanzas
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Optimiza el flujo de efectivo y simplifica la contabilidad con
            nuestra avanzada caja registradora digital. Gestiona cada
            transacción con precisión y obtén insights valiosos para impulsar tu
            negocio.
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Documenta ventas y gastos con total exactitud y seguridad.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>Monitorea ingresos y egresos en tiempo real.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Facilita la gestión financiera y ahorra tiempo en tareas
                administrativas.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex w-full items-center space-x-4">
            <span className="rounded-full bg-primary/10 p-3">
              <LineChart className="h-4 w-4 text-primary" />
            </span>

            <p className="font-display font-semibold text-lg leading-6">
              <span className="text-primary-text">Reportes</span>{' '}
              personalizados: insights poderosos para tu negocio
            </p>
          </div>

          <span className="text-muted-foreground text-sm leading-6">
            Transforma datos en decisiones estratégicas con nuestros análisis
            avanzados. Descubre tendencias ocultas, comprende a tus clientes y
            optimiza tu inventario para impulsar el crecimiento.
          </span>

          <ul className="w-full space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>Identifica patrones y oportunidades de crecimiento.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>Optimiza tu stock basándote en datos reales.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span>
                Visualiza información compleja de forma clara y accionable.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
