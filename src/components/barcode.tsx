'use client'

import JsBarcode from 'jsbarcode'
import { Download } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '~/components/ui/button'

type Options = JsBarcode.Options

type Props = {
  value: string
  options?: Options
}

const Barcode = ({ value, options }: Props) => {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      JsBarcode(ref.current, value, options)
    }
  }, [value, options])

  const download = () => {
    if (ref.current) {
      const svg = ref.current
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
            const png = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.download = `${value}.png`
            a.href = png
            a.click()
          }
          img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref}></svg>

      <div className="mt-4">
        <Button variant="outline" onClick={download}>
          <Download className="mr-2 h-4 w-4" />
          Descargar
          <span className="sr-only">Código de barras</span>
        </Button>
      </div>
    </div>
  )
}

export default Barcode
