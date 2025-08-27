import moment from 'moment'

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
