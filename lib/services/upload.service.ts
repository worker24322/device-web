import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url?: string;
    urls?: string[];
    count?: number;
    json?: string;
  };
  error?: string;
}

export const uploadService = {
  async uploadSingleImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const token = authService.getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async uploadMultipleImages(files: File[]): Promise<UploadResponse> {
    if (files.length > 4) {
      return {
        success: false,
        message: 'Tối đa 4 hình',
        error: 'Maximum 4 images allowed',
      };
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = authService.getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async deleteImage(path: string): Promise<UploadResponse> {
    const token = authService.getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ path }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Delete failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getImageUrl(path: string): string {
    if (!path) return '/images/banner-camera.webp';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) {
      // Extract base URL from API_BASE_URL (remove /api)
      const baseUrl = API_BASE_URL.replace('/api', '');
      return `${baseUrl}${path}`;
    }
    return path;
  },
};

