import { type NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const bodyStr = await req.formData()

  console.log('epayco -->', bodyStr)

  return NextResponse.json({ message: 'Hello from epayco' }, { status: 200 })
}

export { handler as GET, handler as POST }
