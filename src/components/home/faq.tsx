import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'

const faq = [
  {
    id: 'faq-1',
    title: '¿Qué es Dew y para qué sirve?',
    content:
      'Dew es una aplicación web que funciona como un sistema de ventas POS (Punto de Venta). Permite a los usuarios manejar inventario, realizar ventas rápidas, emitir facturación electrónica, y generar reportes de ventas mensuales y anuales.',
  },
  {
    id: 'faq-2',
    title: '¿Cuánto cuesta usar Dew?',
    content:
      'Actualmente, Dew ofrece un único plan con un costo de 20,000 pesos colombianos por mes. Este plan incluye todas las funciones disponibles en la plataforma.',
  },
  {
    id: 'faq-3',
    title: '¿Cómo puedo generar un reporte de ventas?',
    content:
      'Puedes generar un reporte de ventas desde la página de "Reportes" en Dew. Solo tienes que seleccionar el período que deseas (mensual o anual) y el sistema generará el reporte automáticamente.',
  },
  {
    id: 'faq-4',
    title: '¿Es segura mi información en Dew?',
    content:
      'Sí, tomamos muy en serio la seguridad de su información. Actualmente, todos los datos están protegidos, y estamos trabajando en agregar autenticación en dos pasos y soporte multiusuario mediante permisos para mejorar aún más la seguridad.',
  },
  {
    id: 'faq-5',
    title: '¿Puedo utilizar Dew en mi teléfono móvil o tableta?',
    content:
      'Sí, Dew es una aplicación web accesible desde cualquier navegador, lo que significa que puedes utilizarla en tu computadora, tableta o teléfono móvil sin problemas.',
  },
  {
    id: 'faq-6',
    title: '¿Cómo funciona la facturación electrónica en Dew?',
    content:
      'Dew permite generar facturas electrónicas de manera rápida y sencilla al completar una venta. Las facturas pueden ser enviadas directamente al correo electrónico del cliente o descargadas en formato PDF.',
  },
]

export const FAQSection = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faq.map(({ id, title, content }) => (
        <AccordionItem key={id} value={id}>
          <AccordionTrigger>
            <span className="font-semibold text-xl">{title}</span>
          </AccordionTrigger>
          <AccordionContent>
            <p>{content}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
