import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 10, fontFamily: 'Helvetica' },
  section: { margin: 5, padding: 5 },
  header: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  info: { fontSize: 12, marginBottom: 5, color: 'grey' },
  small: { fontSize: 10 },
  title: { fontSize: 14 },
  p: { fontSize: 12, textAlign: 'justify', marginBottom: 10 },
  products: {
    width: '100%',
    marginTop: 15,
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
})

type Props = {
  id: string
  date: string
  customer: { name: string; id: string; phone?: string }
  store: { name: string; nit: string }
  products: { id: string; name: string; quantity: number; price: number }[]
  total: number
}

export const InvoicePDFTemplate = ({
  id,
  date,
  customer,
  store,
  products,
  total,
}: Readonly<Props>) => {
  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.section}>
          <Text style={styles.header}>Dew</Text>

          <Text style={styles.info}>FACTURA ELECTRÓNICA DE VENTA: {id}</Text>
          <Text style={styles.info}>FECHA: {date}</Text>
          <Text style={styles.info}>
            NÚMERO DE DOCUMENTO DEL CLIENTE: {customer.id}
          </Text>
          <Text style={styles.info}>NOMBRE DEL CLIENTE: {customer.name}</Text>
          <Text style={styles.info}>
            TELÉFONO DEL CLIENTE: {customer.phone ?? 'No presenta'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.info}>TIENDA: {store.name}</Text>
          <Text style={styles.info}>NIT DE LA TIENDA: {store.nit}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>PRODUCTOS</Text>

          <View style={styles.products}>
            <View style={styles.row}>
              <View style={styles.colId}>
                <Text>CÓDIGO</Text>
              </View>
              <View style={styles.colName}>
                <Text>NOMBRE</Text>
              </View>
              <View style={styles.colQuantity}>
                <Text>CANTIDAD</Text>
              </View>
              <View style={styles.colPrice}>
                <Text>PRECIO</Text>
              </View>
              <View style={styles.colTotal}>
                <Text>TOTAL</Text>
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

        <View style={styles.section}>
          <Text style={styles.info}>
            TOTAL:{' '}
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(total)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.info, styles.small]}>
            Esta factura es un documento electrónico y no tiene validez legal.
            Fue generada por el sistema de facturación de{' '}
            <Link src="https://dew.cantte.com/">dew</Link>.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
