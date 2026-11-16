import type { StoreConfig } from '../../types/domain'

type DayKey = keyof StoreConfig['hours']['weekly']

const dayKeys: Record<string, DayKey> = {
  Monday: 'monday', Tuesday: 'tuesday', Wednesday: 'wednesday', Thursday: 'thursday',
  Friday: 'friday', Saturday: 'saturday', Sunday: 'sunday',
}

function timeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  return Object.fromEntries(parts.map((part) => [part.type, part.value]))
}

function minutesFromTime(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

function formatTime(value: string) {
  if (value === '24:00') return 'meia-noite'
  const [hour, minute] = value.split(':').map(Number)
  return minute === 0 ? `${hour}h` : `${hour}h${String(minute).padStart(2, '0')}`
}

function weekdayInZone(date: Date, timeZone: string) {
  return timeParts(date, timeZone).weekday
}

export interface OpeningStatus {
  open: boolean
  message: string
  nextOpening?: string
}

export function getOpeningStatus(store: StoreConfig, now = new Date()): OpeningStatus {
  const parts = timeParts(now, store.hours.timeZone)
  const dayKey = dayKeys[parts.weekday]
  const todayHours = store.hours.weekly[dayKey]
  const minuteOfDay = Number(parts.hour) * 60 + Number(parts.minute)

  if (todayHours && minuteOfDay >= minutesFromTime(todayHours.open) && minuteOfDay < minutesFromTime(todayHours.close)) {
    return { open: true, message: `Aberto até ${formatTime(todayHours.close)}` }
  }

  const localDate = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)))
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = new Date(localDate)
    candidate.setUTCDate(candidate.getUTCDate() + offset)
    const key = dayKeys[weekdayInZone(candidate, 'UTC')]
    const hours = store.hours.weekly[key]
    if (!hours) continue
    if (offset === 0 && minuteOfDay >= minutesFromTime(hours.open)) continue
    const label = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', weekday: 'long' }).format(candidate)
    const dayName = label.charAt(0).toUpperCase() + label.slice(1)
    const when = offset === 0 ? 'hoje' : offset === 1 ? 'amanhã' : dayName
    return { open: false, message: `Abrimos ${when} às ${formatTime(hours.open)}`, nextOpening: hours.open }
  }

  return { open: false, message: 'Consulte nossos próximos horários.' }
}

export function getWeeklyScheduleText(store: StoreConfig) {
  const labels: [DayKey, string][] = [
    ['monday', 'Segunda'], ['tuesday', 'Terça'], ['wednesday', 'Quarta'], ['thursday', 'Quinta'],
    ['friday', 'Sexta'], ['saturday', 'Sábado'], ['sunday', 'Domingo'],
  ]
  return labels.map(([key, label]) => {
    const hours = store.hours.weekly[key]
    if (!hours) return `${label}: fechado`
    const close = hours.close === '24:00' ? 'meia-noite' : formatTime(hours.close)
    return `${label}: ${formatTime(hours.open)}–${close}`
  })
}
