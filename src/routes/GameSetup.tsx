import { Link } from 'react-router-dom'

function Stepper({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-1 text-sm font-medium text-slate-500">{label}</div>
      <div className="flex items-center justify-between">
        <button className="h-12 w-12 rounded-full bg-slate-100 text-2xl font-bold text-slate-700 active:scale-95">
          −
        </button>
        <div className="text-4xl font-bold text-slate-900">{value}</div>
        <button className="h-12 w-12 rounded-full bg-slate-100 text-2xl font-bold text-slate-700 active:scale-95">
          +
        </button>
      </div>
      {hint && <div className="mt-2 text-xs text-slate-400">{hint}</div>}
    </div>
  )
}

export default function GameSetup() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-6 inline-block text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Game setup</h1>

        <div className="space-y-4">
          <Stepper label="Players" value={5} />
          <Stepper label="Imposters" value={1} hint="Max 2 for 5 players" />
        </div>

        <Link
          to="/names"
          className="mt-8 block rounded-2xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white active:scale-[0.98]"
        >
          Next
        </Link>
      </div>
    </div>
  )
}