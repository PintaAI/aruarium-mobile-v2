import { Platform } from 'react-native';
import { fetchWithAuth } from '../auth';
import { API_BASE_URL } from '../config';
import {
  ApiResponse,
  ModuleDetail,
  UpdateModuleCompletionRequest,
  UpdateModuleCompletionResponse,
  ModuleApiError
} from './types';

// API endpoint for module operations
const API_BASE = `${API_BASE_URL}/api/mobile/modules`;

/**
 * Custom error class for module API errors
 */
class ModuleApiErrorImpl extends Error implements ModuleApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ModuleApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Helper function to handle API responses and errors
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    const error = new ModuleApiErrorImpl(
      data.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.status.toString()
    );
    console.error('🚨 Module API Error:', {
      status: response.status,
      message: data.error,
      url: response.url
    });
    throw error;
  }
  
  return data.data;
}

// =============================================================================
// MODULE API FUNCTIONS
// =============================================================================

/**
 * Get a specific module with detailed information
 * @param moduleId - The module ID
 * @returns Promise<ModuleDetail>
 */
export async function getModule(
  moduleId: number
): Promise<ModuleDetail> {
  console.log(`📖 Fetching module: ${moduleId}`);
  
  try {
    const url = `${API_BASE}/${moduleId}`;
    const response = await fetchWithAuth(url);
    const module = await handleApiResponse<ModuleDetail>(response);
    
    console.log(`✅ Retrieved module: ${module.title}`);
    return module;
  } catch (error) {
    console.error(`❌ Failed to fetch module ${moduleId}:`, error);
    throw error;
  }
}

/**
 * Update module completion status
 * @param moduleId - The module ID
 * @param isCompleted - Completion status
 * @returns Promise<UpdateModuleCompletionResponse>
 */
export async function updateModuleCompletion(
  moduleId: number,
  isCompleted: boolean
): Promise<UpdateModuleCompletionResponse> {
  console.log(`✅ Updating completion status for module ${moduleId}: ${isCompleted}`);
  
  try {
    const url = `${API_BASE}/${moduleId}`;
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify({ isCompleted })
    });
    
    const result = await handleApiResponse<UpdateModuleCompletionResponse>(response);
    
    console.log(`✅ Updated module completion: ${moduleId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update module completion ${moduleId}:`, error);
    throw error;
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Check if a module is completed by the user
 * @param module - The module to check
 * @returns boolean
 */
export function isModuleCompleted(module: ModuleDetail): boolean {
  return module.userCompletion?.isCompleted === true;
}

/**
 * Get module completion date
 * @param module - The module to check
 * @returns Date | null
 */
export function getModuleCompletionDate(module: ModuleDetail): Date | null {
  if (module.userCompletion?.isCompleted && module.userCompletion.completedAt) {
    return new Date(module.userCompletion.completedAt);
  }
  return null;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL
 * @returns string | null
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Parse YouTube content from jsonDescription
 * @param jsonDescription - Module's JSON description
 * @returns Array of YouTube video data
 */
export function parseYouTubeContent(jsonDescription: string): Array<{
  videoId: string;
  src: string;
  start?: number;
  width?: number;
  height?: number;
}> {
  try {
    const parsed = JSON.parse(jsonDescription);
    const youtubeVideos: Array<{
      videoId: string;
      src: string;
      start?: number;
      width?: number;
      height?: number;
    }> = [];

    function traverse(content: any) {
      if (Array.isArray(content)) {
        content.forEach(traverse);
      } else if (content && typeof content === 'object') {
        if (content.type === 'youtube' && content.attrs?.src) {
          const videoId = extractYouTubeVideoId(content.attrs.src);
          if (videoId) {
            youtubeVideos.push({
              videoId,
              src: content.attrs.src,
              start: content.attrs.start || 0,
              width: content.attrs.width || 640,
              height: content.attrs.height || 480,
            });
          }
        }
        if (content.content) {
          traverse(content.content);
        }
      }
    }

    traverse(parsed);
    return youtubeVideos;
  } catch (error) {
    console.error('Failed to parse YouTube content:', error);
    return [];
  }
}

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export const moduleApi = {
  // Main operations
  getModule,
  updateModuleCompletion,
  
  // Utility functions
  isModuleCompleted,
  getModuleCompletionDate,
  extractYouTubeVideoId,
  parseYouTubeContent,
  
  // Error class
  ModuleApiError: ModuleApiErrorImpl
};

// Default export for backward compatibility
export default moduleApi;
