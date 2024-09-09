'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { formatToCurrency } from '~/text/format'

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false)

  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1)

  return (
    <div className="flex flex-col items-center gap-4">
      <Tabs defaultValue="0" onValueChange={togglePricingPeriod}>
        <TabsList>
          <TabsTrigger value="0">Mensual</TabsTrigger>
          <TabsTrigger value="1">Anual</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        <Card className="max-w-96">
          <CardHeader className="pt-4 pb-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Plan inicial</CardTitle>

              {isYearly && <Badge>Ahorra 25%</Badge>}
            </div>

            <div className="flex gap-0.5">
              <h3 className="font-bold text-3xl">
                {formatToCurrency('es-CO', isYearly ? 180000 : 20000)}
              </h3>
              <span className="mb-1 flex flex-col justify-end text-sm">
                /{isYearly ? 'año' : 'mes'}
              </span>
            </div>

            <CardDescription className="h-12 pt-1.5">
              Acceso completo a nuestra plataforma.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base">
              Con el plan básico podrás disfrutar de un acceso completo a
              nuestra plataforma.
            </p>
          </CardContent>

          <CardFooter>
            <Button className="w-full" size="lg" asChild>
              <Link href="/dashboard/subscription/create">Comprar</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
