import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FAKE_PLAYERS, FAKE_WORD } from '../data/wordPairs'

type RevealState = 'pre' | 'shown' | 'hidden'

export default function Reveal() {
  const { playerIndex } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useState<RevealState>('pre')

  const idx = Number(playerIndex ?? 0)
  const playerName = FAKE_PLAYERS[idx] ?? 'Unknown'
  const isLast = idx === FAKE_PLAYERS.length - 1

  function handleBodyTap() {
    if (state === 'pre') setState('shown')
    else if (state === 'shown') setState('hidden')
  }

  function handleNext() {
    if (isLast) {
      navigate('/kick')
    } else {
      navigate(`/reveal/${idx + 1}`)
      // Note: setState here would race; the route change unmounts and remounts
      // with a fresh 'pre' state, which is what we want.
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div
        className="flex flex-1 cursor-pointer items-center justify-center px-6"
        onClick={state !== 'hidden' ? handleBodyTap : undefined}
      >
        {state === 'pre' && (
          <div className="text-center">
            <div className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
              Player {idx + 1} of {FAKE_PLAYERS.length}
            </div>
            <div className="text-3xl font-semibold text-slate-900">{playerName},</div>
            <div className="mt-2 text-xl text-slate-600">tap to reveal your word.</div>
          </div>
        )}

        {state === 'shown' && (
          <div className="text-center">
            <div className="text-6xl font-bold text-slate-900">{FAKE_WORD}</div>
            <div className="mt-8 text-sm text-slate-400">Tap to hide.</div>
          </div>
        )}

        {state === 'hidden' && (
          <div className="text-center">
            {isLast ? (
              <>
                <div className="text-2xl font-semibold text-slate-900">
                  All players have seen their word.
                </div>
                <div className="mt-2 text-lg text-slate-600">Start discussion.</div>
              </>
            ) : (
              <div className="text-2xl font-semibold text-slate-900">
                Pass to {FAKE_PLAYERS[idx + 1]}.
              </div>
            )}
          </div>
        )}
      </div>

      {state === 'hidden' && (
        <div className="px-4 pb-8">
          <button
            onClick={handleNext}
            className="block w-full rounded-2xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white active:scale-[0.98]"
          >
            {isLast ? 'Start voting' : 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}