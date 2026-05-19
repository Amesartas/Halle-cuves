import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

const MAX_CHARS = 60

function extractFields(body: Record<string, unknown>): { plat?: string; prix?: string } {
  // GHL envoie les champs custom sous "customData" ou directement à la racine
  const sources = [
    body.customData,
    body.formData,
    body,
  ].filter(Boolean) as Record<string, unknown>[]

  for (const src of sources) {
    const plat =
      (src['plat'] as string) ||
      (src['plat_du_jour'] as string) ||
      (src['Plat du jour'] as string)
    const prix =
      (src['prix'] as string) ||
      (src['Prix'] as string)
    if (plat || prix) return { plat, prix }
  }

  return {}
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

  const { plat, prix } = extractFields(body)

  if (!plat || !prix) {
    return NextResponse.json(
      { error: 'Champs "plat" et "prix" requis' },
      { status: 400 }
    )
  }

  const platTronque = plat.trim().substring(0, MAX_CHARS)
  const prixNettoye = String(prix).trim()

  const { error } = await supabase
    .from('stands')
    .update({
      plat: platTronque,
      prix: prixNettoye,
      submitted_at: new Date().toISOString(),
    })
    .eq('token', token)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
