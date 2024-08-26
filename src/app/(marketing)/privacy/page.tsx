import Footer from '~/components/footer'
import { MainNav } from '~/components/main-nav'

export default function PrivacyPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MainNav />
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-6">
        <div className="max-w-xl w-full space-y-4">
          <h1 className="font-bold text-4xl">Política de privacidad</h1>

          <p className="text-xl text-muted-foreground">
            Ultima actualización: 26 de agosto del 2024
          </p>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            En Dew, accesible desde https://dew.cantte.com/, nos comprometemos a
            proteger la privacidad y seguridad de la información personal de
            nuestros usuarios. Esta política de privacidad describe cómo
            recopilamos, utilizamos, y protegemos su información personal cuando
            utiliza nuestro servicio.
          </p>

          <h2 className="font-bold text-2xl">
            Recopilación y uso de información
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Recopilamos la siguiente información personal de nuestros usuarios:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Información de pago</li>
          </ul>

          <h2 className="font-bold text-2xl">Cómo usamos su información</h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            La información que recopilamos se utiliza para:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Procesar pagos de manera segura</li>
            <li>Mejorar y optimizar nuestro servicio</li>
            <li>
              Enviar notificaciones relacionadas con su cuenta o servicios
            </li>
          </ul>

          <h2 className="font-bold text-2xl">Compartición de información</h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Dew no comparte su información personal con terceros. Su información
            se maneja exclusivamente dentro de nuestra plataforma.
          </p>

          <h2 className="font-bold text-2xl">
            Almacenamiento y Seguridad de los datos
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Sus datos se almacenan en una base de datos externa altamente
            segura, la cual solo puede ser consultada por Dew. Implementamos
            medidas de seguridad adecuadas para proteger sus datos contra
            accesos no autorizados, alteraciones, divulgaciones o destrucción.
          </p>

          <h2 className="font-bold text-2xl">
            Derechos de los usuarios sobre su información
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Usted tiene todos los derechos sobre sus datos personales. Esto
            incluye el derecho a acceder, corregir, o eliminar su información
            personal en cualquier momento. Si desea ejercer cualquiera de estos
            derechos, póngase en contacto con nosotros a través de
            contact@cantte.com.
          </p>

          <h2 className="font-bold text-2xl">
            Uso de cookies y tecnologías similares
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Dew utiliza cookies para gestionar la autenticación de los usuarios,
            utilizando Google como proveedor de autenticación. Estas cookies son
            necesarias para garantizar un acceso seguro y personalizado a
            nuestra plataforma.
          </p>

          <h2 className="font-bold text-2xl">Enlaces a otros sitios</h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Nuestro servicio puede contener enlaces a sitios web de terceros que
            no son operados por nosotros. Si hace clic en un enlace de un
            tercero, será redirigido al sitio web de ese tercero. Le
            recomendamos que revise la política de privacidad de cada sitio web
            que visite.
          </p>

          <h2 className="font-bold text-2xl">
            Cambios en la política de privacidad
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Nos reservamos el derecho de modificar esta política de privacidad
            en cualquier momento. Le notificaremos cualquier cambio publicando
            la nueva política de privacidad en esta página.
          </p>

          <h2 className="font-bold text-2xl">Contacto</h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Si tiene alguna pregunta o inquietud sobre nuestra política de
            privacidad, puede contactarnos a través de contact@cantte.com.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
