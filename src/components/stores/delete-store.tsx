import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

export const DeleteStore = ({ store }: Props) => {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-destructive text-xl">
            Eliminar tienda
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-destructive/80">
          Si deseas eliminar tu tienda, puedes hacerlo aquí. Ten en cuenta que
          esta acción no se puede deshacer.
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="destructive" disabled>
          Deseo eliminar mi tienda
        </Button>
      </CardFooter>
    </Card>
  )
}
