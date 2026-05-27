import { Link } from 'react-router-dom'
import { FAKE_PLAYERS } from '../data/wordPairs'

export default function Reorder() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/names" className="mb-6 inline-block text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Reveal order</h1>
        <p className="mb-8 text-sm text-slate-500">Drag to reorder. (Disabled in M1.)</p>

        <div className="space-y-2">
          {FAKE_PLAYERS.map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <span className="text-sm font-medium text-slate-400">{i + 1}</span>
              <span className="text-lg text-slate-900">{name}</span>
              <span className="ml-auto text-slate-300">≡</span>
            </div>
          ))}
        </div>

        <Link
          to="/reveal/0"
          className="mt-8 block rounded-2xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white active:scale-[0.98]"
        >
          Start game
        </Link>
      </div>
    </div>
  )
}