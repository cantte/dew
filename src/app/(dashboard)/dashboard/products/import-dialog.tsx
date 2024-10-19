'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { mkConfig } from 'export-to-csv'
import { Download, FileUp, RotateCw, Upload } from 'lucide-react'
import Papa from 'papaparse'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Label } from '~/components/ui/label'
import { useToast } from '~/components/ui/use-toast'
import { exportToCsv } from '~/lib/csv'
import { bulkCreateProductInput } from '~/server/api/schemas/products'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

type ImportProductData = TypeOf<
  typeof bulkCreateProductInput
>['products'][number]

type FormValues = TypeOf<typeof bulkCreateProductInput>

const ImportProductsDialog = ({ store }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      products: [],
      store: store.id,
    },
    resolver: zodResolver(bulkCreateProductInput),
  })

  const bulkCreateProduct = api.product.bulkCreate.useMutation()
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    bulkCreateProduct.mutate(data)
  }

  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const utils = api.useUtils()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (bulkCreateProduct.isSuccess) {
      toast({
        title: 'Productos importados',
        description: 'Los productos han sido importados correctamente',
      })

      setOpen(false)
      setFile(undefined)

      form.reset()

      utils.product.list.invalidate()
    }
  }, [bulkCreateProduct.isSuccess])

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (bulkCreateProduct.error) {
      form.setError('products', {
        type: 'manual',
        message: bulkCreateProduct.error.message,
      })
    }
  }, [bulkCreateProduct.error])

  const [file, setFile] = useState<File | undefined>(undefined)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5, // 5 MB
    accept: {
      'application/vnd.ms-excel': ['.csv'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv'],
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (file === undefined) {
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const fields = result.meta.fields

        if (fields === undefined) {
          return
        }

        if (fields.length < 7) {
          return
        }

        const data = result.data as Record<string, string>[]
        const products: ImportProductData[] = data.map((row) => ({
          code: row[fields.at(0) as string] ?? '',
          name: row[fields.at(1) as string] ?? '',
          description: row[fields.at(2) as string],
          purchasePrice: parseFloat(row[fields.at(3) as string] ?? '0'),
          salePrice: parseFloat(row[fields.at(4) as string] ?? '0'),
          quantity: parseFloat(row[fields.at(5) as string] ?? '0'),
          stock: parseFloat(row[fields.at(6) as string] ?? '0'),
        }))

        form.setValue('products', products)
      },
    })
  }, [file])

  const downloadTemplate = () => {
    const rows = [
      {
        codigo: '',
        nombre: '',
        descripcion: '',
        'precio de compra': 0,
        'precio de venta': 0,
        cantidad: 0,
        stock: 0,
      },
    ]

    const config = mkConfig({
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
      filename: 'template-productos',
    })

    exportToCsv(config, rows)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FileUp />
          Importar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar productos</DialogTitle>
          <DialogDescription>
            El archivo debe contener las columnas necesarias para importar
            productos y en el siguiente orden:{' '}
            <strong>
              código, nombre, descripción, precio de compra, precio de venta,
              cantidad, stock
            </strong>{' '}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline">{store.name}</Badge>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 gap-1"
              onClick={downloadTemplate}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Descargar plantilla
              </span>
            </Button>
          </div>

          <Form {...form}>
            <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <div
                      className="grid w-full items-center gap-1.5"
                      {...getRootProps()}
                    >
                      <Label
                        htmlFor="file"
                        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-5"
                      >
                        <span className="flex items-center gap-1.5">
                          <Upload size={24} />
                          <span className="font-medium text-foreground text-sm">
                            {file !== undefined
                              ? file.name
                              : 'Arrastra un archivo o haz clic aquí'}
                          </span>
                        </span>

                        <span className="pt-2 text-muted-foreground text-xs">
                          {isDragActive
                            ? 'Suelta el archivo aquí'
                            : 'Solo se permiten archivos CSV de hasta 5MB'}
                        </span>
                      </Label>

                      <input {...getInputProps()} />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={bulkCreateProduct.isPending}>
                {bulkCreateProduct.isPending && (
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                Importar
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImportProductsDialog
