import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="flex h-[80px] flex-col items-center justify-center text-center">
      <span className="inline-flex items-center gap-2 font-normal text-muted-foreground text-sm">
        {new Date().getFullYear()} © dew
      </span>
      <span className="inline-flex items-center gap-2 font-normal text-muted-foreground text-sm">
        Creado con <span className="text-red-500">❤</span> por
        <Link
          href="https://github.com/cantte"
          target="_blank"
          className="text-foreground transition-colors duration-200 hover:text-foreground/80"
        >
          cantte
        </Link>
      </span>
    </footer>
  )
}

export default Footer
