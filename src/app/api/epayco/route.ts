import { type NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  try {
    const bodyStr = await req.formData()

    console.log('epayco -->', bodyStr)
  } catch (error) {
    console.error('epayco error -->', error)
  }

  return NextResponse.json({ message: 'Hello from epayco' }, { status: 200 })
}

export { handler as GET, handler as POST }
