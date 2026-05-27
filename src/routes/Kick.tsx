import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FAKE_PLAYERS } from '../data/wordPairs'

export default function Kick() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState([...FAKE_PLAYERS])
  const [pendingKick, setPendingKick] = useState<string | null>(null)
  const [kicksConfirmed, setKicksConfirmed] = useState(0)

  function confirmKick() {
    if (!pendingKick) return
    const next = players.filter((p) => p !== pendingKick)
    setPlayers(next)
    setPendingKick(null)
    const newCount = kicksConfirmed + 1
    setKicksConfirmed(newCount)
    if (newCount >= 2) {
      navigate('/win')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Tap to kick</h1>
        <p className="mb-8 text-sm text-slate-500">{players.length} players remaining.</p>

        <div className="space-y-2">
          {players.map((name) => (
            <button
              key={name}
              onClick={() => setPendingKick(name)}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-lg text-slate-900 active:scale-[0.98]"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {pendingKick && (
        <div className="fixed inset-0 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl">
            <div className="mb-6 text-center text-xl font-semibold text-slate-900">
              Kick {pendingKick}?
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingKick(null)}
                className="flex-1 rounded-2xl bg-slate-100 px-6 py-4 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmKick}
                className="flex-1 rounded-2xl bg-red-600 px-6 py-4 font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}