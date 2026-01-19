/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace Bengali characters with transliteration approximations
    .replace(/[আঅ]/g, 'a')
    .replace(/[ইউঊ]/g, 'u')
    .replace(/[এঐ]/g, 'e')
    .replace(/[ওঔ]/g, 'o')
    .replace(/ক/g, 'k')
    .replace(/খ/g, 'kh')
    .replace(/গ/g, 'g')
    .replace(/ঘ/g, 'gh')
    .replace(/চ/g, 'ch')
    .replace(/ছ/g, 'chh')
    .replace(/জ/g, 'j')
    .replace(/ঝ/g, 'jh')
    .replace(/ট/g, 't')
    .replace(/ঠ/g, 'th')
    .replace(/ড/g, 'd')
    .replace(/ঢ/g, 'dh')
    .replace(/ণ/g, 'n')
    .replace(/ত/g, 't')
    .replace(/থ/g, 'th')
    .replace(/দ/g, 'd')
    .replace(/ধ/g, 'dh')
    .replace(/ন/g, 'n')
    .replace(/প/g, 'p')
    .replace(/ফ/g, 'ph')
    .replace(/ব/g, 'b')
    .replace(/ভ/g, 'bh')
    .replace(/ম/g, 'm')
    .replace(/য/g, 'j')
    .replace(/র/g, 'r')
    .replace(/ল/g, 'l')
    .replace(/শ/g, 'sh')
    .replace(/ষ/g, 'sh')
    .replace(/স/g, 's')
    .replace(/হ/g, 'h')
    .replace(/[য়]/g, 'y')
    .replace(/ং/g, 'ng')
    .replace(/ঃ/g, 'h')
    .replace(/ঁ/g, '')
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars
    .replace(/[^\w\-]+/g, '')
    // Replace multiple - with single -
    .replace(/\-\-+/g, '-')
    // Remove - from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

/**
 * Format number with Bengali digits
 */
export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return num.toString().split('').map(digit => {
    return /\d/.test(digit) ? bengaliDigits[parseInt(digit)] : digit
  }).join('')
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Get role hierarchy level (higher = more permissions)
 */
export function getRoleLevel(role: string): number {
  const roleLevels: Record<string, number> = {
    admin: 4,
    moderator: 3,
    author: 2,
    contributor: 1,
  }
  return roleLevels[role] || 0
}

/**
 * Check if user can perform action based on role
 */
export function canPerformAction(userRole: string, requiredRole: string): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}

/**
 * Sanitize filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\.]/g, '')
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(html: string, length: number = 160): string {
  const text = stripHtml(html)
  return truncateText(text, length)
}
