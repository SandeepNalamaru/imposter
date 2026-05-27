import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/wordPairs'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Imposter</h1>
        <p className="mb-8 text-sm text-slate-500">Pick a category to start.</p>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/setup"
              className={`block rounded-2xl border bg-white px-5 py-4 text-lg font-medium text-slate-900 shadow-sm transition active:scale-[0.98] ${
                cat.id === 'spicy'
                  ? 'border-red-200 bg-red-50'
                  : cat.id === 'random'
                    ? 'border-dashed border-slate-300 bg-slate-100 text-slate-600'
                    : 'border-slate-200'
              }`}
            >
              {cat.id === 'spicy' && '🌶️ '}
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}