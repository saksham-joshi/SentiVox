'use client'

import {
  useState,
  useRef,
  useEffect,
  useSyncExternalStore,
  ChangeEvent,
} from 'react'
import {
  SendHorizontal,
  Loader2,
  ChevronDown,
  Check,
  Mic,
  MicOff,
  Square,
  Languages,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
  if (typeof window === 'undefined') return null
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

// Support never changes at runtime, so there's nothing to subscribe to
const noopSubscribe = () => () => {}

interface VoiceLanguage {
  code: string // BCP-47 tag handed to SpeechRecognition.lang
  short: string
  label: string
  native: string
}

const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'en-IN', short: 'EN', label: 'English', native: 'English' },
  { code: 'hi-IN', short: 'HI', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr-IN', short: 'MR', label: 'Marathi', native: 'मराठी' },
  { code: 'ta-IN', short: 'TA', label: 'Tamil', native: 'தமிழ்' },
]

interface SpeechNotice {
  kind: 'error' | 'info'
  text: string
}

const MIC_BLOCKED =
  'Microphone access is blocked. Click the lock icon in the address bar, allow the microphone, then try again.'

const SPEECH_ERRORS: Record<string, string> = {
  'not-allowed': MIC_BLOCKED,
  'service-not-allowed': 'Speech recognition is blocked in this browser',
  'audio-capture': 'No microphone was found. Please connect one and try again.',
  'no-speech': 'No speech detected — try again',
  network: 'Network error during speech recognition',
}

/**
 * Resolves to `null` when the microphone is usable, otherwise to a
 * user-facing reason it isn't. `onPrompt` fires right before the browser's
 * permission dialog is about to appear.
 */
async function checkMicrophoneAccess(
  onPrompt: () => void
): Promise<string | null> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return window.isSecureContext
      ? 'Your browser does not allow microphone access.'
      : 'Voice input needs a secure (HTTPS) connection.'
  }

  // Permissions API can't always query "microphone" (e.g. older Safari/Firefox);
  // in that case we fall through and let getUserMedia decide.
  let state: PermissionState | undefined
  try {
    const status = await navigator.permissions?.query({
      name: 'microphone' as PermissionName,
    })
    state = status?.state
  } catch {
    state = undefined
  }

  if (state === 'denied') return MIC_BLOCKED
  if (state === 'granted') return null

  // 'prompt' or unknown → ask now so the browser shows its permission dialog
  onPrompt()
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
    return null
  } catch (err) {
    switch ((err as DOMException).name) {
      case 'NotAllowedError':
      case 'SecurityError':
        return MIC_BLOCKED
      case 'NotFoundError':
      case 'OverconstrainedError':
        return SPEECH_ERRORS['audio-capture']
      case 'NotReadableError':
        return 'Your microphone is being used by another app. Close it and try again.'
      default:
        return 'Could not access the microphone.'
    }
  }
}

type AnalysisType = 'context-free' | 'context-based'

interface AnalysisOption {
  value: AnalysisType
  label: string
  disabled?: boolean
  soon?: boolean
}

const ANALYSIS_OPTIONS: AnalysisOption[] = [
  { value: 'context-free', label: 'Context-Free Analysis' },
  {
    value: 'context-based',
    label: 'Context-Based Analysis',
    disabled: true,
    soon: true,
  },
]

interface AnalyzerInputProps {
  onAnalyze: (text: string) => void
  isLoading: boolean
  value?: string
  readOnly?: boolean
}

export default function AnalyzerInput({
  onAnalyze,
  isLoading,
  value,
  readOnly = false,
}: AnalyzerInputProps) {
  const [text, setText] = useState(value ?? '')
  const [analysisType, setAnalysisType] = useState<AnalysisType>('context-free')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [langCode, setLangCode] = useState(VOICE_LANGUAGES[0].code)
  const [langOpen, setLangOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined) setText(value)
  }, [value])

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(target)
      ) {
        setLangOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Server snapshot is `false`, so SSR markup matches and the real value
  // is picked up on the client without a hydration mismatch.
  const speechSupported = useSyncExternalStore(
    noopSubscribe,
    () => getSpeechRecognition() !== null,
    () => false
  )
  const [isListening, setIsListening] = useState(false)
  // True while we verify / request microphone permission
  const [isCheckingMic, setIsCheckingMic] = useState(false)
  const [speechNotice, setSpeechNotice] = useState<SpeechNotice | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const isMountedRef = useRef(false)
  // Bumped to invalidate a start request that is still awaiting permission
  const startTokenRef = useRef(0)
  // Text that was already in the textarea when recording started
  const baseTextRef = useRef('')
  // Finalized transcript for the current recording session
  const finalTextRef = useRef('')

  const selectedLang =
    VOICE_LANGUAGES.find((l) => l.code === langCode) ?? VOICE_LANGUAGES[0]

  // Errors fade out on their own; info stays until the check resolves
  useEffect(() => {
    if (speechNotice?.kind !== 'error') return
    const timer = setTimeout(() => setSpeechNotice(null), 7000)
    return () => clearTimeout(timer)
  }, [speechNotice])

  // Abort any active recording on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      const recognition = recognitionRef.current
      if (recognition) {
        recognition.onresult = null
        recognition.onend = null
        recognition.onerror = null
        recognition.abort()
      }
    }
  }, [])

  const startListening = async () => {
    if (recognitionRef.current || isCheckingMic) return
    setSpeechNotice(null)

    // Check 1 — does this browser implement the Web Speech API?
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) {
      setSpeechNotice({
        kind: 'error',
        text: "Your browser doesn't support voice input. Please use Chrome, Edge or Safari.",
      })
      return
    }

    // Check 2 — is the microphone permission granted (or can we get it)?
    const token = ++startTokenRef.current
    setIsCheckingMic(true)
    const micError = await checkMicrophoneAccess(() =>
      setSpeechNotice({
        kind: 'info',
        text: 'Please click "Allow" in your browser to let Senti-Vox use the microphone.',
      })
    )
    // Unmounted, or the user sent the message while we were waiting
    if (!isMountedRef.current || token !== startTokenRef.current) return
    setIsCheckingMic(false)
    if (micError) {
      setSpeechNotice({ kind: 'error', text: micError })
      return
    }
    setSpeechNotice(null)

    baseTextRef.current = text.trimEnd()
    finalTextRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = selectedLang.code

    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) finalTextRef.current += ` ${transcript}`
        else interim += ` ${transcript}`
      }
      const spoken = `${finalTextRef.current}${interim}`
        .replace(/\s+/g, ' ')
        .trim()
      const base = baseTextRef.current
      setText(base && spoken ? `${base} ${spoken}` : base || spoken)
    }

    recognition.onerror = (e) => {
      if (e.error === 'aborted') return
      const message =
        e.error === 'language-not-supported'
          ? `${selectedLang.label} voice input isn't supported by this browser.`
          : (SPEECH_ERRORS[e.error] ?? 'Speech recognition failed')
      setSpeechNotice({ kind: 'error', text: message })
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
      textareaRef.current?.focus()
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsListening(true)
    } catch {
      recognitionRef.current = null
      setSpeechNotice({
        kind: 'error',
        text: 'Could not start the microphone.',
      })
    }
  }

  const stopListening = (discardPending = false) => {
    const recognition = recognitionRef.current
    if (!recognition) return
    // abort() drops in-flight results; stop() lets the last phrase finalize
    if (discardPending) recognition.abort()
    else recognition.stop()
  }

  const toggleListening = () => {
    if (isListening) stopListening()
    else void startListening()
  }

  const canSubmit = text.trim().length >= 3 && !isLoading && !readOnly

  const handleSubmit = () => {
    if (!canSubmit) return
    // Don't let a late transcript land in the box after sending
    startTokenRef.current++
    setIsCheckingMic(false)
    stopListening(true)
    onAnalyze(text.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
    // Plain Enter → newline (default textarea behavior)
  }

  const selectedOption = ANALYSIS_OPTIONS.find((o) => o.value === analysisType)!

  return (
    <div className={cn('w-full', readOnly && 'opacity-70 pointer-events-none')}>
      {/* Input container */}
      <div
        className={cn(
          'relative rounded-xl border transition-all duration-300',
          readOnly
            ? 'border-border/30 bg-surface/30'
            : cn(
                'border-border/50 bg-surface/40 backdrop-blur-sm',
                // Hover: nudge border up slightly, no color jump
                'hover:border-border/80',
                // Focus: soft primary tint + subtle outer glow ring instead of harsh border jump
                'focus-within:border-primary/30',
                'focus-within:shadow-[0_0_0_3px_rgba(2,187,173,0.07),0_0_24px_rgba(2,187,173,0.04)]',
                // Recording: soft danger tint so it's obvious the mic is live
                isListening &&
                  'border-danger/40 hover:border-danger/40 focus-within:border-danger/40 shadow-[0_0_0_3px_rgba(228,93,120,0.08),0_0_24px_rgba(228,93,120,0.06)] focus-within:shadow-[0_0_0_3px_rgba(228,93,120,0.08),0_0_24px_rgba(228,93,120,0.06)]'
              )
        )}
      >
        <textarea
          ref={textareaRef}
          id={readOnly ? undefined : 'chat-input'}
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={
            readOnly
              ? ''
              : isListening
                ? `Listening in ${selectedLang.label}… start speaking`
                : 'Enter text to analyze… (Ctrl + Enter to send)'
          }
          // Live transcript owns the text while recording
          readOnly={isListening}
          aria-label={readOnly ? 'Previous message' : 'Message input'}
          aria-describedby={readOnly ? undefined : 'chat-input-hint'}
          className={cn(
            'w-full min-h-22 max-h-80 resize-y bg-transparent',
            'px-4 pt-3 pb-2 text-sm text-foreground',
            'placeholder:text-foreground-muted/60',
            // Suppress the global :focus-visible outline — the container handles the focus ring
            'focus:outline-none focus-visible:outline-none!',
            readOnly && 'cursor-default resize-none text-foreground-secondary'
          )}
          disabled={isLoading || readOnly}
          rows={3}
        />

        {!readOnly && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3 pt-1">
            {/* ── Left: Analysis-type dropdown ───────────────────────── */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label="Select analysis type"
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                  'text-xs font-medium transition-all duration-200 border',
                  dropdownOpen
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border/50 bg-surface-soft/50 text-foreground-secondary hover:border-border/80 hover:text-foreground'
                )}
              >
                {/* Active dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate max-w-37.5">
                  {selectedOption.label}
                </span>
                <ChevronDown
                  size={11}
                  className={cn(
                    'shrink-0 text-foreground-muted transition-transform duration-200',
                    dropdownOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown panel — opens upward */}
              {dropdownOpen && (
                <div
                  role="listbox"
                  aria-label="Analysis type"
                  className={cn(
                    'absolute bottom-full mb-2 left-0 z-50 min-w-53.75',
                    'rounded-xl overflow-hidden',
                    'border border-border/60 bg-surface',
                    'shadow-xl shadow-black/30',
                    'animate-slide-up'
                  )}
                >
                  <div className="py-1">
                    {ANALYSIS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        role="option"
                        type="button"
                        aria-selected={analysisType === option.value}
                        aria-disabled={option.disabled}
                        onClick={() => {
                          if (!option.disabled) {
                            setAnalysisType(option.value)
                            setDropdownOpen(false)
                          }
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 py-2.5 text-xs text-left',
                          'transition-colors duration-150',
                          option.disabled
                            ? 'text-foreground-disabled cursor-not-allowed'
                            : analysisType === option.value
                              ? 'text-primary bg-primary/10 cursor-default'
                              : 'text-foreground-secondary hover:bg-surface-soft hover:text-foreground cursor-pointer'
                        )}
                      >
                        {/* Check-mark slot keeps layout stable */}
                        <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                          {analysisType === option.value &&
                            !option.disabled && (
                              <Check
                                size={12}
                                className="text-primary"
                                aria-hidden="true"
                              />
                            )}
                        </span>
                        <span className="flex-1">{option.label}</span>
                        {option.soon && (
                          <span
                            className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full shrink-0"
                            aria-label="feature coming soon"
                          >
                            Soon
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: char count / listening + mic + send ──────────── */}
            <div className="flex items-center gap-2.5 ml-auto">
              {isListening ? (
                <span
                  role="status"
                  className="flex items-center gap-1.5 text-xs font-medium text-danger animate-fade-in"
                >
                  <span
                    className="flex items-center gap-0.5 h-3"
                    aria-hidden="true"
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-0.5 h-full rounded-full bg-danger animate-voice-bar"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                  <span className="hidden sm:inline">Listening…</span>
                </span>
              ) : (
                text.length > 0 && (
                  <span className="text-xs text-foreground-muted tabular-nums">
                    {text.length} chars
                  </span>
                )
              )}

              {/* Voice language — recognition language can't change mid-recording */}
              <div className="relative shrink-0" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((prev) => !prev)}
                  disabled={isListening || isCheckingMic || isLoading}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label={`Voice language: ${selectedLang.label}`}
                  title="Voice language"
                  className={cn(
                    'flex items-center gap-1.5 h-7 px-1.5 rounded-lg border',
                    'text-xs font-medium transition-all duration-200',
                    langOpen
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : isListening || isCheckingMic || isLoading
                        ? 'border-border/30 bg-surface-soft/30 text-foreground-disabled cursor-not-allowed'
                        : 'border-border/50 bg-surface-soft/50 text-foreground-secondary hover:border-border/80 hover:text-foreground'
                  )}
                >
                  <Languages size={12} aria-hidden="true" />
                  <span>{selectedLang.short}</span>
                </button>

                {langOpen && (
                  <div
                    role="listbox"
                    aria-label="Voice language"
                    className={cn(
                      'absolute bottom-full mb-2 right-0 z-50 min-w-44',
                      'rounded-xl overflow-hidden',
                      'border border-border/60 bg-surface',
                      'shadow-xl shadow-black/30',
                      'animate-slide-up'
                    )}
                  >
                    <div className="py-1">
                      {VOICE_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          role="option"
                          type="button"
                          lang={lang.code}
                          aria-selected={langCode === lang.code}
                          onClick={() => {
                            setLangCode(lang.code)
                            setLangOpen(false)
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left',
                            'transition-colors duration-150',
                            langCode === lang.code
                              ? 'text-primary bg-primary/10 cursor-default'
                              : 'text-foreground-secondary hover:bg-surface-soft hover:text-foreground cursor-pointer'
                          )}
                        >
                          <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                            {langCode === lang.code && (
                              <Check
                                size={12}
                                className="text-primary"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <span className="flex-1 text-sm">{lang.native}</span>
                          {lang.native !== lang.label && (
                            <span className="text-[10px] text-foreground-muted shrink-0">
                              {lang.label}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mic: toggles browser speech-to-text. Stays clickable when the
                  browser lacks support so the click can explain why. */}
              <button
                type="button"
                id="mic-btn"
                onClick={toggleListening}
                disabled={isLoading || isCheckingMic}
                aria-pressed={isListening}
                aria-label={
                  isListening ? 'Stop voice input' : 'Start voice input'
                }
                title={
                  !speechSupported
                    ? 'Voice input is not supported in this browser'
                    : isListening
                      ? 'Stop recording'
                      : `Speak to type (${selectedLang.label})`
                }
                className={cn(
                  'relative flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-200',
                  isListening
                    ? 'border-danger/50 bg-danger/15 text-danger hover:bg-danger/25'
                    : isLoading || isCheckingMic
                      ? 'border-border/30 bg-surface-soft/30 text-foreground-disabled cursor-not-allowed'
                      : !speechSupported
                        ? 'border-border/30 bg-surface-soft/30 text-foreground-disabled hover:border-danger/40 hover:text-danger'
                        : 'border-border/50 bg-surface-soft/50 text-foreground-secondary hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
                )}
              >
                {isListening && (
                  <span
                    className="absolute inset-0 rounded-lg border border-danger/60 animate-ping"
                    aria-hidden="true"
                  />
                )}
                {isCheckingMic ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : !speechSupported ? (
                  <MicOff size={16} aria-hidden="true" />
                ) : isListening ? (
                  <Square size={12} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Mic size={16} aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                id="send-btn"
                onClick={handleSubmit}
                disabled={!canSubmit}
                aria-label={
                  isLoading ? 'Analyzing…' : 'Send message (Ctrl+Enter)'
                }
                className={cn(
                  'flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-lg transition-all duration-200',
                  canSubmit
                    ? 'bg-primary text-background hover:bg-primary-hover'
                    : 'bg-surface-soft text-foreground-disabled cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <SendHorizontal size={16} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? 'Analyzing…' : 'Send'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Voice errors / info replace the keyboard hint while they're relevant */}
      {!readOnly && speechNotice && (
        <p
          role={speechNotice.kind === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex items-start justify-center gap-1.5 text-xs mt-2 animate-fade-in',
            speechNotice.kind === 'error' ? 'text-danger' : 'text-info'
          )}
        >
          {speechNotice.kind === 'error' ? (
            <MicOff size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span>{speechNotice.text}</span>
        </p>
      )}

      {/* Keyboard hint */}
      {!readOnly && !speechNotice && (
        <p
          id="chat-input-hint"
          className="text-center text-xs text-foreground-muted mt-2"
        >
          Press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface text-foreground font-mono text-[10px] border border-border">
            Ctrl
          </kbd>{' '}
          +{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface text-foreground font-mono text-[10px] border border-border">
            Enter
          </kbd>{' '}
          to send
        </p>
      )}
    </div>
  )
}
