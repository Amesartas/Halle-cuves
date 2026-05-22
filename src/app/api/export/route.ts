import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('stands')
    .select('stand_name, plat, prix, submitted_at')
    .order('stand_name')

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
  }

  console.log('[export] rows fetched:', data?.length, '| first:', JSON.stringify(data?.[0]))

  const rows = (data ?? []).map((row) => ({
    Stand: row.stand_name,
    'Plat du jour': row.plat ?? '—',
    Prix: row.prix ?? '—',
    'Soumis le': row.submitted_at
      ? new Date(row.submitted_at).toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Non soumis',
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  ws['!cols'] = [
    { wch: 25 },
    { wch: 65 },
    { wch: 15 },
    { wch: 22 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Menu de la semaine')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const today = new Date().toISOString().split('T')[0]

  return new NextResponse(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="menus-halle-${today}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
