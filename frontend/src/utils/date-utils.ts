import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

/**
 * Safely parses a date string and returns a formatted date
 * @param dateString - The date string from the API
 * @returns Object with formatted date and relative time, or error messages
 */
export function safeFormatDate(dateString: string | null | undefined) {
  // Handle null, undefined, or empty string
  if (!dateString || dateString.trim() === '') {
    return {
      formatted: 'تاريخ غير محدد',
      relative: '',
      isValid: false,
      error: 'No date provided'
    };
  }

  try {
    // Try parsing as ISO string first
    let date = parseISO(dateString);
    
    // If that fails, try new Date()
    if (!isValid(date)) {
      date = new Date(dateString);
    }

    // Check if the parsed date is valid
    if (!isValid(date)) {
      console.error('Invalid date string:', dateString);
      return {
        formatted: 'تاريخ غير صحيح',
        relative: '',
        isValid: false,
        error: `Invalid date format: ${dateString}`
      };
    }

    // Format the valid date
    const formatted = format(date, 'PPP', { locale: ar });
    const relative = formatDistanceToNow(date, { locale: ar, addSuffix: true });

    return {
      formatted,
      relative,
      isValid: true,
      error: null
    };
    
  } catch (error) {
    console.error('Error parsing date:', error, 'Date string:', dateString);
    return {
      formatted: 'خطأ في التاريخ',
      relative: '',
      isValid: false,
      error: `Parse error: ${error}`
    };
  }
}

/**
 * Debug function to log date parsing information
 */
export function debugDateValue(dateString: any, context: string = '') {
  console.group(`Date Debug ${context ? `(${context})` : ''}`);
  console.log('Raw value:', dateString);
  console.log('Type:', typeof dateString);
  console.log('Is null/undefined:', dateString == null);
  console.log('Is empty string:', dateString === '');
  console.log('String length:', typeof dateString === 'string' ? dateString.length : 'N/A');
  
  if (dateString) {
    const result = safeFormatDate(dateString);
    console.log('Parse result:', result);
  }
  
  console.groupEnd();
}