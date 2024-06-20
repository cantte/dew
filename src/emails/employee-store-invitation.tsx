import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig from "~/config/email/tailwind";

type Props = {
  employeeName: string;
  storeName: string;
  url: string;
};

const EmployeeStoreInvitationEmail = ({
  employeeName,
  storeName,
  url,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Invitación a la tienda</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="mx-auto my-auto px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text className="scroll-m-20 text-xl font-semibold tracking-tight">
              Hola {employeeName}, has sido invitado a la tienda {storeName}.
            </Text>

            <Text>
              Puedes acceder a la tienda dando clic en el siguiente enlace:
            </Text>

            <Container className="flex justify-center">
              <Button
                className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white"
                href={url}
              >
                Acceder a la tienda
              </Button>
            </Container>

            <Text className="text-xs text-neutral-500">
              Este enlace es personal e intransferible y solo puede ser usado
              por ti una vez.
            </Text>

            <Hr />

            <Text className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Dew. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmployeeStoreInvitationEmail;
