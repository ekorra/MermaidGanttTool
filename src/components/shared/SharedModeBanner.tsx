import { useState } from 'react'
import { useLocale } from '../../i18n/LocaleContext'
import { saveShare } from '../../utils/shareApi'
import type { GanttChart } from '../../model/types'

interface SharedModeBannerProps {
  shareId: string
  chart: GanttChart
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function SharedModeBanner({ shareId, chart }: SharedModeBannerProps) {
  const { t } = useLocale()
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async () => {
    setSaveState('saving')
    const result = await saveShare(shareId, chart)
    if (result.ok) {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    } else {
      setErrorMsg(result.error)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 4000)
    }
  }

  const saveLabel =
    saveState === 'saving' ? t.sharedBannerSaving :
    saveState === 'saved' ? t.sharedBannerSaved :
    t.sharedBannerSave

  return (
    <div style={{
      background: 'var(--color-primary)',
      color: '#fff',
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 12,
      flexShrink: 0,
    }}>
      <span style={{ fontWeight: 600 }}>{t.sharedBannerInfo}</span>
      <span style={{ opacity: 0.8 }}>·</span>
      <span style={{ opacity: 0.8 }}>{t.sharedBannerExpiry}</span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {saveState === 'error' && (
          <span style={{ opacity: 0.9, fontSize: 11 }}>{t.sharedBannerSaveError(errorMsg)}</span>
        )}
        <button
          onClick={() => { void handleSave() }}
          disabled={saveState === 'saving' || saveState === 'saved'}
          style={{
            padding: '4px 12px',
            background: saveState === 'saved' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 4,
            cursor: saveState === 'saving' || saveState === 'saved' ? 'default' : 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
