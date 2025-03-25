import { format, parseISO } from 'date-fns';
import { APP_CONFIG } from '../constants/config';

export const formatDate = (date: string | Date, formatStr = APP_CONFIG.DATE_FORMATS.DISPLAY): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, APP_CONFIG.DATE_FORMATS.DATETIME);
};

export const toISODate = (date: Date): string => {
  return format(date, APP_CONFIG.DATE_FORMATS.ISO);
};
