'use client'

import { ChevronsUpDown, Plus, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { RegisterStoreDialog } from '~/components/stores/register-store.dialog'
import { Badge } from '~/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/react'

export const SelectStore = () => {
  const { data: currentStore, isFetching: isFetchingCurrentStore } =
    api.store.findCurrent.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })
  const { data: stores, isFetching: isFetchingStores } =
    api.store.list.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

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

  const [openRegisterStore, setOpenRegisterStore] = useState(false)

  const showSkeleton =
    (isFetchingCurrentStore || isFetchingStores) && !currentStore

  if (showSkeleton) {
    return <Skeleton className="h-12 w-full" />
  }

  if (!currentStore) {
    return (
      <Badge variant="destructive" className="py-2 text-center">
        No hay tiendas registradas
      </Badge>
    )
  }

  const onSelectStore = (storeId: string) => {
    if (storeId === 'new') {
      setOpenRegisterStore(true)
      return
    }

    setCurrentStore.mutate({ storeId })
  }

  const disabled = setCurrentStore.isPending || isFetchingCurrentStore

  return (
    <Fragment>
      <RegisterStoreDialog
        open={openRegisterStore}
        onOpenChange={setOpenRegisterStore}
      />

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                disabled={disabled}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentStore.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Tiendas
              </DropdownMenuLabel>
              {stores?.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => onSelectStore(store.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center">
                    <Store className="size-4 shrink-0" />
                  </div>
                  {store.name}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => onSelectStore('new')}
              >
                <div className="flex size-6 items-center justify-center">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Registrar tienda
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Fragment>
  )
}
