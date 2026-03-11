import { getDailyTip } from '@/lib/environmental-tips'
import { NextResponse } from 'next/server'

export async function GET() {
  const tip = getDailyTip()
  return NextResponse.json({ tip })
}
