import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import {
  formatToCurrency,
  formatToDateShort,
  formatToDateWithTime,
} from '~/text/format'

const styles = StyleSheet.create({
  page: { padding: 10 },
  section: { margin: 5, padding: 5 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  info: { fontSize: 10, marginBottom: 5 },
  small: { fontSize: 10 },
  title: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  p: { fontSize: 12, textAlign: 'justify', marginBottom: 10 },
  products: {
    width: '100%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  colId: {
    width: '20%',
    fontSize: 12,
    marginBottom: 5,
  },
  colName: {
    width: '30%',
    fontSize: 12,
    marginBottom: 5,
  },
  colPrice: {
    width: '20%',
    fontSize: 12,
    marginBottom: 5,
  },
  colQuantity: {
    width: '15%',
    fontSize: 12,
    marginBottom: 5,
  },
  colTotal: {
    width: '15%',
    fontSize: 12,
    marginBottom: 5,
  },
  spacer: {
    height: 20,
  },
  bold: {
    fontWeight: 700,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    width: '100%',
    marginBottom: 10,
  },
})

type Props = {
  id: string
  date: string
  customer: { name: string; id: string; phone?: string }
  store: { name: string; nit: string }
  products: { id: string; name: string; quantity: number; price: number }[]
  amount: number
  payment: number
  paymentMethod: string
}

export const InvoicePDFTemplate = ({
  id,
  date,
  customer,
  store,
  products,
  amount,
  payment,
  paymentMethod,
}: Readonly<Props>) => {
  const today = new Date()

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.info}>
              {formatToDateWithTime('es-CO', today)}
            </Text>

            <Text style={styles.info}>Dew</Text>
          </View>

          <View style={styles.spacer}></View>

          <Text style={[styles.title, styles.bold]}>
            {store.name.toUpperCase()} - FACTURA DE VENTA
          </Text>

          <View style={styles.spacer}></View>

          <Text style={styles.info}>
            Fecha de emisión: {formatToDateWithTime('es-CO', new Date(date))}
          </Text>

          <Text style={styles.info}>Método de pago: {paymentMethod}</Text>

          <Text style={styles.info}>
            Vencimiento: {formatToDateShort('es-CO', new Date(date))}
          </Text>

          <View style={styles.spacer}></View>

          <Text style={[styles.title, styles.bold]}>{customer.name}</Text>

          <Text style={[styles.title]}>CC {customer.id}</Text>
        </View>

        <View style={styles.line}></View>

        <View style={styles.section}>
          <View style={styles.products}>
            <View style={styles.row}>
              <View style={styles.colId}>
                <Text>Código</Text>
              </View>
              <View style={styles.colName}>
                <Text>Nombre</Text>
              </View>
              <View style={styles.colQuantity}>
                <Text>Cantidad</Text>
              </View>
              <View style={styles.colPrice}>
                <Text>Precio</Text>
              </View>
              <View style={styles.colTotal}>
                <Text>Total</Text>
              </View>
            </View>

            {products.map((product) => (
              <View style={styles.row} key={product.id}>
                <View style={[styles.colId, styles.small]}>
                  <Text>{product.id}</Text>
                </View>
                <View style={[styles.colName, styles.small]}>
                  <Text>{product.name}</Text>
                </View>
                <View style={[styles.colQuantity, styles.small]}>
                  <Text>
                    {Intl.NumberFormat('es-CO').format(product.quantity)}
                  </Text>
                </View>
                <View style={[styles.colPrice, styles.small]}>
                  <Text>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(product.price)}
                  </Text>
                </View>
                <View style={[styles.colTotal, styles.small]}>
                  <Text>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(product.price * product.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.line}></View>

        <View style={styles.section}>
          <Text style={styles.info}>
            Total: {formatToCurrency('es-CO', amount)}
          </Text>

          <Text style={styles.info}>
            Total recibido: {formatToCurrency('es-CO', payment)}
          </Text>

          {payment - amount > 0 && (
            <Text style={styles.info}>
              Cambio: {formatToCurrency('es-CO', payment - amount)}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.info, styles.small]}>
            Generada por{' '}
            <Link src="https://dew.cantte.com/">dew.cantte.com</Link>.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
