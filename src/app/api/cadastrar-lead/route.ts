import { NextRequest, NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || ''
const TOKEN = process.env.NEXT_PUBLIC_DASHBOARD_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.Nome?.trim() || !body.Telefone?.trim()) {
      return NextResponse.json({ error: 'Nome e Telefone são obrigatórios' }, { status: 400 })
    }

    if (!BASE) {
      return NextResponse.json({ error: 'N8N URL não configurada' }, { status: 503 })
    }

    const res = await fetch(`${BASE}/webhook/dash-api?token=${TOKEN}&type=cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`n8n HTTP ${res.status}: ${text.substring(0, 200)}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
