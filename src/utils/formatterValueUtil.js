import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date) {
  if (!date) return 'Data não informada'

  return format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy')
}

export function getDayWeek(date) {
  if (!date) return 'Data não informada'

  const dayWeek = format(new Date(date + 'T00:00:00'), 'EEE', {locale: ptBR})

  return dayWeek
}

export function removeSpecialCharacters(value) {
  if (!value) return 'Valor não informado'

  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

