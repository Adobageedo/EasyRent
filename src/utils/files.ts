import { APP_CONFIG } from '../constants/config';

export const validateFileSize = (file: File): boolean => {
  return file.size <= APP_CONFIG.UPLOAD.MAX_FILE_SIZE;
};

export const validateImageType = (file: File): boolean => {
  return APP_CONFIG.UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type);
};

export const validateDocumentType = (file: File): boolean => {
  return APP_CONFIG.UPLOAD.ALLOWED_DOCUMENT_TYPES.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
