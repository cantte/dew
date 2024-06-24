type Props = {
  value: number
  date: Date
}

const ValueDateTooltip = ({ value, date }: Props) => {
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="text-sm">
        {Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value)}
      </p>

      <p className="text-xs text-muted-foreground">
        {Intl.DateTimeFormat('es-CO', {
          day: 'numeric',
          month: 'short',
        }).format(date)}
      </p>
    </div>
  )
}

export default ValueDateTooltip
