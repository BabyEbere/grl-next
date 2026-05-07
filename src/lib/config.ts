/**
 * Central configuration for the application.
 * All API calls should use these constants.
 */

// The base URL for the PHP backend API
export const PHP_API_URL = process.env.NEXT_PUBLIC_PHP_API_URL || 'https://zucglobalresourcesltd.com/api/handler.php';

// The base URL for the Next.js frontend
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zucglobalresourcesltd.com';

// Contact endpoints (specific logic)
export const CONTACT_API_URL = PHP_API_URL.replace('handler.php', 'contact.php');
