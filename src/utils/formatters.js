import moment from 'moment'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatBrMoney = value => {
    return (
        value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
        }) + '/ mês'
    )
}

export const formatDate = date => {
    return new Date(date).toLocaleDateString('pt-BR')
}

export const formatCPF = cpf => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatTime = (time, use12 = false) => {
    if (use12) return moment(time).format('hh:mm A')

    return moment(time).format('HH:mm')
}

export function formatEventTime(hour, use12 = false) {
    if (!hour) return ''

    if (use12) {
        return hour.format(hour.minutes() > 0 ? 'h.mma' : 'ha').slice(0, -1)
    }

    return hour.format(hour.minutes() > 0 ? 'HH.mm' : 'HH')
}

export const formatDateTime = dateTime => {
    if (!dateTime) return

    const date = new Date(dateTime)

    return format(date, 'Pp', { locale: ptBR })
}

export const capitalizeFirstLetter = string => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
}

export const formatSize = bytes => {
    if (!bytes) return null

    if (bytes < 1024) return `${bytes} bytes`

    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`

    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`

    if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(2)} GB`

    if (bytes < 1024 ** 5) return `${(bytes / 1024 ** 4).toFixed(2)} TB`

    if (bytes < 1024 ** 6) return `${(bytes / 1024 ** 5).toFixed(2)} PB`

    if (bytes < 1024 ** 7) return `${(bytes / 1024 ** 6).toFixed(2)} EB`

    if (bytes < 1024 ** 8) return `${(bytes / 1024 ** 7).toFixed(2)} ZB`

    if (bytes < 1024 ** 9) return `${(bytes / 1024 ** 8).toFixed(2)} YB`

    return bytes
}

export const formatTypeDocument = type => {
    switch (type) {
        case 'application/pdf':
            return 'PDF'
        case 'application/msword':
            return 'DOC'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'DOCX'
        case 'application/vnd.ms-excel':
            return 'XLS'
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'XLSX'
        case 'application/vnd.ms-powerpoint':
            return 'PPT'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'PPTX'
        case 'text/plain':
            return 'TXT'
        case 'application/rtf':
            return 'RTF'
        case 'text/csv':
            return 'CSV'
        case 'application/zip':
            return 'ZIP'
        case 'application/vnd.rar':
        case 'application/x-rar-compressed':
            return 'RAR'
        case 'application/x-7z-compressed':
            return '7Z'
        default:
            return 'ARQUIVO'
    }
}

export const formatTextForLimited = (text, qtd = 20) => {
    if (!text) return text

    if (text.length > qtd) {
        return `${text.slice(0, qtd)} ...`
    }

    return text
}

export const formatMessageWhatsapp = message => {
    if (!message) return message

    return message
        .replace(/\\n/g, '\n')
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '&nbsp;&nbsp;&nbsp;&nbsp;• $1')
        .replace(/\n/g, '<br>')
}
