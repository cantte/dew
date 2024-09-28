'use client'

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
      utils.store.findCurrent.invalidate()
      router.refresh()
    }
  }, [setCurrentStore.isSuccess])

  if (isFetchingCurrentStore || isFetchingStores) {
    return <Skeleton className="h-8 w-40" />
  }

  if (!currentStore) {
    return <Badge variant="destructive">Sin tienda</Badge>
  }

  const onSelectStore = async (storeId: string) => {
    setCurrentStore.mutate({ storeId })
  }

  return (
    <Select
      value={currentStore.id}
      onValueChange={(value) => onSelectStore(value)}
    >
      <SelectTrigger className="w-40">
        <SelectValue>{currentStore.name}</SelectValue>
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
