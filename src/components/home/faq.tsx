import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '~/components/ui/accordion'

export const FAQSection = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="faq-1">
        <AccordionTrigger>¿Qué es Dew y para qué sirve?</AccordionTrigger>
        <AccordionContent>
          Dew es una aplicación web que funciona como un sistema de ventas POS
          (Punto de Venta). Permite a los usuarios manejar inventario, realizar
          ventas rápidas, emitir facturación electrónica, y generar reportes de
          ventas mensuales y anuales.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-2">
        <AccordionTrigger>¿Cuánto cuesta usar Dew?</AccordionTrigger>
        <AccordionContent>
          Actualmente, Dew ofrece un único plan con un costo de 20,000 pesos
          colombianos por mes. Este plan incluye todas las funciones disponibles
          en la plataforma.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-3">
        <AccordionTrigger>
          ¿Cómo puedo generar un reporte de ventas?
        </AccordionTrigger>
        <AccordionContent>
          Puedes generar un reporte de ventas desde la página de "Reportes" en
          Dew. Solo tienes que seleccionar el período que deseas (mensual o
          anual) y el sistema generará el reporte automáticamente.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-4">
        <AccordionTrigger>¿Es segura mi información en Dew?</AccordionTrigger>
        <AccordionContent>
          Sí, tomamos muy en serio la seguridad de su información. Actualmente,
          todos los datos están protegidos, y estamos trabajando en agregar
          autenticación en dos pasos y soporte multiusuario mediante permisos
          para mejorar aún más la seguridad.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-5">
        <AccordionTrigger>
          ¿Puedo utilizar Dew en mi teléfono móvil o tableta?
        </AccordionTrigger>
        <AccordionContent>
          Sí, Dew es una aplicación web accesible desde cualquier navegador, lo
          que significa que puedes utilizarla en tu computadora, tableta o
          teléfono móvil sin problemas.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-6">
        <AccordionTrigger>
          ¿Cómo funciona la facturación electrónica en Dew?
        </AccordionTrigger>
        <AccordionContent>
          Dew permite generar facturas electrónicas de manera rápida y sencilla
          al completar una venta. Las facturas pueden ser enviadas directamente
          al correo electrónico del cliente o descargadas en formato PDF.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
