import { Link } from 'react-router-dom'

export default function NameEntry() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/setup" className="mb-6 inline-block text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Player names</h1>
        <p className="mb-8 text-sm text-slate-500">Add 5 players.</p>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <input
              key={n}
              type="text"
              placeholder={`Player ${n}`}
              maxLength={20}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
          ))}
        </div>

        <Link
          to="/reorder"
          className="mt-8 block rounded-2xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white active:scale-[0.98]"
        >
          Next
        </Link>
      </div>
    </div>
  )
}