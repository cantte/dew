import DefaultLayout from '~/components/default-layout'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return <DefaultLayout>{children}</DefaultLayout>
}

export default Layout
