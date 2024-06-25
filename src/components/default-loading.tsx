import { Skeleton } from '~/components/ui/skeleton'

const DefaultLoading = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}

export default DefaultLoading
