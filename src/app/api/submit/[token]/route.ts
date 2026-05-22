import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const MAX_CHARS = 60

function extractFields(body: Record<string, unknown>): { plat?: string; prix?: string } {
  const src = body as Record<string, string>

  const plat =
    src['plat'] ||
    src['Plat de la semaine'] ||
    src['Plat du jour'] ||
    src['plat_du_jour'] ||
    (body.customData as Record<string, string>)?.['plat']

  const prix =
    src['prix'] ||
    src['Prixduplat'] ||
    src['Prix du plat'] ||
    src['Prix'] ||
    (body.customData as Record<string, string>)?.['prix']

  return { plat, prix }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[submit] token:', token, '| body:', JSON.stringify(body))

  const { plat, prix } = extractFields(body)

  console.log('[submit] plat:', plat, '| prix:', prix)

  if (!plat || !prix) {
    return NextResponse.json(
      { error: 'Champs "plat" et "prix" requis', received: body },
      { status: 400 }
    )
  }

  const platTronque = plat.trim().substring(0, MAX_CHARS)
  const prixNettoye = String(prix).trim()

  const { data, error } = await getSupabase()
    .from('stands')
    .update({
      plat: platTronque,
      prix: prixNettoye,
      submitted_at: new Date().toISOString(),
    })
    .eq('token', token)
    .select()

  if (error) {
    console.error('[submit] ERREUR SUPABASE:', JSON.stringify(error))
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  if (!data || data.length === 0) {
    console.error('[submit] TOKEN INTROUVABLE:', token)
    return NextResponse.json({ error: 'Token invalide', token }, { status: 404 })
  }

  console.log('[submit] SAUVEGARDÉ:', data[0].stand_name, '| plat:', data[0].plat)

  const { data: verify } = await getSupabase()
    .from('stands')
    .select('plat, prix')
    .eq('token', token)
    .single()
  console.log('[submit] DB_VERIFY:', JSON.stringify(verify))

  return NextResponse.json({ success: true, stand: data[0].stand_name })
}
