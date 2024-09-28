'use client'

import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/react'

export const SelectStore = () => {
  const { data: currentStore, isFetching: isFetchingCurrentStore } =
    api.store.findCurrent.useQuery()
  const { data: stores, isFetching: isFetchingStores } =
    api.store.list.useQuery()

  const setCurrentStore = api.userPreference.update.useMutation()
  const utils = api.useUtils()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (setCurrentStore.isSuccess) {
      router.refresh()
      utils.store.findCurrent.invalidate()
    }
  }, [setCurrentStore.isSuccess])

  const showSkeleton =
    (isFetchingCurrentStore || isFetchingStores) && !currentStore

  if (showSkeleton) {
    return <Skeleton className="h-8 w-40" />
  }

  if (!currentStore) {
    return <Badge variant="destructive">Sin tienda</Badge>
  }

  const onSelectStore = async (storeId: string) => {
    setCurrentStore.mutate({ storeId })
  }

  const disabled = setCurrentStore.isPending || isFetchingCurrentStore

  return (
    <Select
      value={currentStore.id}
      onValueChange={(value) => onSelectStore(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-56">
        <SelectValue>
          <div className="flex items-center gap-2 overflow-hidden">
            {disabled && <RotateCw className="h-4 w-4 animate-spin" />}
            <span>{currentStore.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {stores?.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
