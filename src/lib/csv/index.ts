import { download, generateCsv, type mkConfig } from 'export-to-csv'

export type ExportableToCsv = {
  [k: string]: string | number | boolean | null
  [k: number]: string | number | boolean | null
}

type ExportConfig = ReturnType<typeof mkConfig>
type Data = ExportableToCsv[]

export const exportToCsv = (config: ExportConfig, data: Data) => {
  const csv = generateCsv(config)(data)

  download(config)(csv)
}
