import { Link } from 'react-router-dom'
import { FAKE_PAIR } from '../data/wordPairs'

export default function Win() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-8 text-4xl font-bold text-emerald-600">Civilians Win</div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Civilians' word
              </div>
              <div className="text-2xl font-semibold text-slate-900">{FAKE_PAIR.civilian}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Imposters' word
              </div>
              <div className="text-2xl font-semibold text-slate-900">{FAKE_PAIR.imposter}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/setup"
            className="block rounded-2xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white active:scale-[0.98]"
          >
            Play again
          </Link>
          <Link
            to="/"
            className="block rounded-2xl bg-slate-100 px-6 py-4 text-center text-lg font-semibold text-slate-700 active:scale-[0.98]"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  )
}