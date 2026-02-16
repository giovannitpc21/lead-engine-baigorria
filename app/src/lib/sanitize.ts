// src/lib/sanitize.ts

/**
 * Sanitiza texto general (nombre, mensaje, etc.)
 */
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')           // Eliminar < y >
    .replace(/javascript:/gi, '')   // Eliminar javascript:
    .replace(/on\w+\s*=/gi, '')    // Eliminar onclick=, onload=, etc
    .replace(/\0/g, '')            // Null byte
    .slice(0, 1000);               // Máximo 1000 caracteres
};

/**
 * Sanitiza y valida email
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) throw new Error('Email requerido');
  
  const trimmed = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    throw new Error('Email inválido');
  }
  
  if (trimmed.length > 254) {
    throw new Error('Email demasiado largo');
  }
  
  return trimmed;
};

/**
 * Sanitiza teléfono
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Solo números, +, espacios, guiones, paréntesis
  const cleaned = phone.replace(/[^0-9+\s\-()]/g, '');
  
  if (cleaned.length > 20) {
    throw new Error('Teléfono inválido');
  }
  
  return cleaned.trim();
};

/**
 * Sanitiza número
 */
export const sanitizeNumber = (value: string | number): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    throw new Error('Número inválido');
  }
  
  return num;
};

/**
 * Sanitiza URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmed = url.trim();
  
  // Debe empezar con http:// o https://
  if (!trimmed.match(/^https?:\/\//i)) {
    throw new Error('URL inválida - debe empezar con http:// o https://');
  }
  
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    throw new Error('URL mal formada');
  }
};

/**
 * Sanitiza input de búsqueda
 */
export const sanitizeSearch = (query: string): string => {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>'"]/g, '')
    .slice(0, 200);
};

type SanitizeType = 'text' | 'email' | 'phone' | 'number' | 'url';

/**
 * Sanitiza objeto completo (para formularios)
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(
  data: T,
  schema: { [K in keyof T]?: SanitizeType }
): T => {
  const sanitized = { ...data };
  
  for (const key in schema) {
    const type = schema[key];
    const value = data[key];
    
    if (value === undefined || value === null) continue;
    
    try {
      switch (type) {
        case 'text':
          sanitized[key] = sanitizeText(String(value)) as T[Extract<keyof T, string>];
          break;
        case 'email':
          sanitized[key] = sanitizeEmail(String(value)) as T[Extract<keyof T, string>];
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(String(value)) as T[Extract<keyof T, string>];
          break;
        case 'number':
          sanitized[key] = sanitizeNumber(value as string | number) as T[Extract<keyof T, string>];
          break;
        case 'url':
          sanitized[key] = sanitizeUrl(String(value)) as T[Extract<keyof T, string>];
          break;
      }
    } catch (error) {
      console.error(`Error sanitizing ${String(key)}:`, error);
      throw error;
    }
  }
  
  return sanitized;
};

/**
 * Valida que no haya SQL injection básico
 */
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /(\bOR\b|\bAND\b).*[=<>]/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Valida que no haya XSS básico
 */
export const detectXss = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*onerror[^>]*>/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitización completa con detección de ataques
 */
export const sanitizeAndValidate = (input: string, type: 'text' | 'email' | 'phone' = 'text'): string => {
  // Detectar ataques
  if (detectSqlInjection(input)) {
    throw new Error('Input sospechoso detectado (SQL)');
  }
  
  if (detectXss(input)) {
    throw new Error('Input sospechoso detectado (XSS)');
  }
  
  // Sanitizar según tipo
  switch (type) {
    case 'email':
      return sanitizeEmail(input);
    case 'phone':
      return sanitizePhone(input);
    default:
      return sanitizeText(input);
  }
};