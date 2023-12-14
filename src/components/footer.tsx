const Footer = () => {
  return (
    <footer className="flex h-[80px] flex-col items-center justify-center text-center">
      <span className="inline-flex items-center gap-2 text-sm font-normal text-muted-foreground">
        {new Date().getFullYear()} © dew
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-normal text-muted-foreground">
        Creado con <span className="text-red-500">❤</span> por
        <a
          href="https://github.com/cantte"
          target="_blank"
          className="text-foreground transition-colors duration-200 hover:text-foreground/80"
        >
          cantte
        </a>
      </span>
    </footer>
  );
};

export default Footer;
