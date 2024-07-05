type Props = {
  command: string
}

const KeyboardCommand = ({ command }: Props) => {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
      <span className="text-xs">{command}</span>
    </kbd>
  )
}

export default KeyboardCommand
