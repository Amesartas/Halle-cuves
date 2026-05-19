import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { error } = await getSupabase()
    .from('stands')
    .update({ plat: null, prix: null, submitted_at: null })
    .not('id', 'is', null)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Reset échoué' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    reset_at: new Date().toISOString(),
  })
}
