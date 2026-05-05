'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react'

const CATEGORIAS = [
  { value: '', label: 'Selecione...' },
  { value: 'casamento', label: 'Casamento' },
  { value: '15_anos', label: '15 Anos' },
  { value: 'aniversario', label: 'Aniversário' },
  { value: 'ensaio', label: 'Ensaio' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'outro', label: 'Outro' },
]

const ORIGENS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'google', label: 'Google' },
  { value: 'site', label: 'Site' },
  { value: 'manual', label: 'Manual' },
]

const STATUS_OPCOES = [
  { value: 'EM_ATENDIMENTO', label: 'Em Atendimento' },
  { value: 'ORCAMENTO_ENVIADO', label: 'Orçamento Enviado' },
  { value: 'AGUARDANDO_SINAL', label: 'Aguardando Sinal' },
  { value: 'Agendado', label: 'Agendado' },
  { value: 'FECHADO', label: 'Fechado' },
]

type FormState = {
  Nome: string
  Telefone: string
  Origem: string
  Categoria: string
  Tipo_evento: string
  Data_evento: string
  Cidade: string
  Local_evento: string
  Observacoes: string
  Status_lead: string
}

const EMPTY: FormState = {
  Nome: '',
  Telefone: '',
  Origem: 'manual',
  Categoria: '',
  Tipo_evento: '',
  Data_evento: '',
  Cidade: '',
  Local_evento: '',
  Observacoes: '',
  Status_lead: 'EM_ATENDIMENTO',
}

export function CadastrarLeadModal({ onClose, onSaved }: {
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.Nome.trim() || !form.Telefone.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/cadastrar-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`)
      setStatus('success')
    } catch (err) {
      setErrorMsg(String(err))
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-green-400" />
            <h2 className="text-zinc-100 font-semibold">Cadastrar Lead</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-10 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-900/40 border border-green-700/50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <div>
              <p className="text-zinc-100 font-semibold text-lg">Lead cadastrado!</p>
              <p className="text-zinc-400 text-sm mt-1">{form.Nome} foi adicionado à planilha de Leads.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setForm(EMPTY); setStatus('idle') }}
                className="btn-secondary text-sm"
              >
                Cadastrar outro
              </button>
              <button onClick={() => { onSaved(); onClose() }} className="btn-primary text-sm">
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

              {/* Nome + Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Nome <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.Nome}
                    onChange={e => set('Nome', e.target.value)}
                    placeholder="Nome completo"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Telefone <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.Telefone}
                    onChange={e => set('Telefone', e.target.value)}
                    placeholder="5521999999999"
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              {/* Origem + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Origem</label>
                  <select value={form.Origem} onChange={e => set('Origem', e.target.value)} className="select-field w-full">
                    {ORIGENS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Status</label>
                  <select value={form.Status_lead} onChange={e => set('Status_lead', e.target.value)} className="select-field w-full">
                    {STATUS_OPCOES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Categoria + Tipo evento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Categoria</label>
                  <select value={form.Categoria} onChange={e => set('Categoria', e.target.value)} className="select-field w-full">
                    {CATEGORIAS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Tipo de Evento</label>
                  <input
                    type="text"
                    value={form.Tipo_evento}
                    onChange={e => set('Tipo_evento', e.target.value)}
                    placeholder="Ex: Casamento civil"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Data evento + Cidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Data do Evento</label>
                  <input
                    type="date"
                    value={form.Data_evento}
                    onChange={e => set('Data_evento', e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1.5">Cidade</label>
                  <input
                    type="text"
                    value={form.Cidade}
                    onChange={e => set('Cidade', e.target.value)}
                    placeholder="Ex: Niterói, RJ"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1.5">Local do Evento</label>
                <input
                  type="text"
                  value={form.Local_evento}
                  onChange={e => set('Local_evento', e.target.value)}
                  placeholder="Nome do local ou endereço"
                  className="input-field w-full"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1.5">Observações</label>
                <textarea
                  value={form.Observacoes}
                  onChange={e => set('Observacoes', e.target.value)}
                  rows={3}
                  placeholder="Informações adicionais..."
                  className="input-field w-full resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 flex-shrink-0">
              <button type="button" onClick={onClose} className="btn-secondary text-sm">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={status === 'loading' || !form.Nome.trim() || !form.Telefone.trim()}
                className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <><Loader2 size={14} className="animate-spin" /> Salvando...</>
                ) : (
                  <><UserPlus size={14} /> Cadastrar Lead</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
