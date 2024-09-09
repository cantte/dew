import { LineChart, Scaling, Shapes, Store } from 'lucide-react'

const features = [
  {
    name: 'Gestión multi-tienda.',
    description:
      'Administra todas tus sucursales desde una única plataforma centralizada, simplificando la expansión de tu negocio.',
    icon: Store,
  },
  {
    name: 'Reportes financieros detallados.',
    description:
      'Visualiza y analiza tus ventas y ganancias con informes mensuales y anuales para una toma de decisiones informada.',
    icon: LineChart,
  },
  {
    name: 'Interfaz intuitiva.',
    description:
      'Disfruta de una experiencia de usuario simplificada que facilita la gestión diaria de tu negocio.',
    icon: Shapes,
  },
  {
    name: 'Escalabilidad sin complicaciones.',
    description:
      'Adapta Dew a las necesidades cambiantes de tu empresa, desde pequeños negocios hasta grandes corporaciones.',
    icon: Scaling,
  },
]

export const SideBySide = () => {
  return (
    <div className="overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <p className="mt-2 font-semibold text-2xl tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Impulsa tu negocio con Dew
              </p>
              <p className="mt-6 leading-8">
                Facturación electrónica e inventario simplificados para impulsar
                tu negocio.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-muted-foreground leading-7 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-foreground">
                      <feature.icon
                        className="absolute top-1 left-1 h-5 w-5 text-primary-text"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline dark:text-gray-400">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
