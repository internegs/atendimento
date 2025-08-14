import moment from 'moment';

export const formatBrMoney = (value) => {
  
  return value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  }) + '/ mês';
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
}

export const formatCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const formatTime = ( time, use12 = false ) => {
  if ( use12 ) return moment(time).format('hh:mm A');
  
  return moment(time).format('HH:mm');
}

export function formatEventTime(hour, use12 = false) {
  if (!hour) return '';
  
  if (use12) {
    return hour.format(hour.minutes() > 0 ? 'h.mma' : 'ha').slice(0, -1);
  }
  
  return hour.format(hour.minutes() > 0 ? 'HH.mm' : 'HH');
}

export const capitalizeFirstLetter = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}