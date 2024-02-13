import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  total: number;
  products: number;
  date: Date;
}

export const NewSaleCustomerEmail = ({
  name,
  total,
  products,
  date,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Nueva venta registrada</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Hola {name}, hemos registrado una nueva venta en nuestro sistema.
            </Text>

            <Text className="leading-7 [&:not(:first-child)]:mt-6">
              <Text className="leading-7 [&:not(:first-child)]:mt-6">
                Fecha de venta:{" "}
                {Intl.DateTimeFormat("es-CO", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(date ?? new Date())}
              </Text>
              <Text className="leading-7 [&:not(:first-child)]:mt-6">
                Productos comprados:{" "}
                {Intl.NumberFormat("es-CO").format(products || 0)}
              </Text>
              <Text className="leading-7 [&:not(:first-child)]:mt-6">
                Total:{" "}
                {Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(total || 0)}
              </Text>
            </Text>

            <Text className="text-sm text-muted-foreground">
              Gracias por tu preferencia.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewSaleCustomerEmail;
