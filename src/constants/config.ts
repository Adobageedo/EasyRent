export const APP_CONFIG = {
  // API endpoints and configurations
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  
  // Storage buckets
  STORAGE: {
    INSPECTION_IMAGES: 'inspection_images',
    PROPERTY_IMAGES: 'property_images',
    DOCUMENTS: 'documents',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'PPP',
    ISO: 'yyyy-MM-dd',
    DATETIME: 'yyyy-MM-dd HH:mm:ss',
  },

  // File upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  },
};
