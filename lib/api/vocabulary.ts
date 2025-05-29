import { Platform } from 'react-native';
import { fetchWithAuth } from '../auth';
import { API_BASE_URL } from '../config';
import {
  ApiResponse,
  VocabularyCollection,
  VocabularyCollectionWithItems,
  CreateCollectionRequest,
  CreateCollectionResponse,
  UpdateCollectionRequest,
  UpdateCollectionResponse,
  DeleteCollectionResponse,
  GetCollectionsParams,
  VocabularyApiError
} from './types';

// API endpoint for vocabulary operations
const API_BASE = `${API_BASE_URL}/api/mobile/vocabulary`;

/**
 * Custom error class for vocabulary API errors
 */
class VocabularyApiErrorImpl extends Error implements VocabularyApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'VocabularyApiError';
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
    const error = new VocabularyApiErrorImpl(
      data.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.status.toString()
    );
    console.error('🚨 Vocabulary API Error:', {
      status: response.status,
      message: data.error,
      url: response.url
    });
    throw error;
  }
  
  return data.data;
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// =============================================================================
// VOCABULARY COLLECTION API FUNCTIONS
// =============================================================================

/**
 * Get all vocabulary collections with optional filtering
 * @param params - Optional filtering parameters
 * @returns Promise<VocabularyCollection[]>
 */
export async function getVocabularyCollections(
  params: GetCollectionsParams = {}
): Promise<VocabularyCollection[]> {
  console.log('📚 Fetching vocabulary collections...', params);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}${queryString}`;
    
    const response = await fetchWithAuth(url);
    const collections = await handleApiResponse<VocabularyCollection[]>(response);
    
    console.log(`✅ Retrieved ${collections.length} vocabulary collections`);
    return collections;
  } catch (error) {
    console.error('❌ Failed to fetch vocabulary collections:', error);
    throw error;
  }
}

/**
 * Get public vocabulary collections only
 * @returns Promise<VocabularyCollection[]>
 */
export async function getPublicVocabularyCollections(): Promise<VocabularyCollection[]> {
  return getVocabularyCollections({ publicOnly: true });
}

/**
 * Get user's vocabulary collections only
 * @returns Promise<VocabularyCollection[]>
 */
export async function getMyVocabularyCollections(): Promise<VocabularyCollection[]> {
  return getVocabularyCollections({ mine: true });
}

/**
 * Get a specific vocabulary collection with its items
 * @param collectionId - The collection ID
 * @returns Promise<VocabularyCollectionWithItems>
 */
export async function getVocabularyCollection(
  collectionId: number
): Promise<VocabularyCollectionWithItems> {
  console.log(`📖 Fetching vocabulary collection: ${collectionId}`);
  
  try {
    const url = `${API_BASE}/${collectionId}`;
    const response = await fetchWithAuth(url);
    const collection = await handleApiResponse<VocabularyCollectionWithItems>(response);
    
    console.log(`✅ Retrieved collection: ${collection.title} with ${collection.items.length} items`);
    return collection;
  } catch (error) {
    console.error(`❌ Failed to fetch vocabulary collection ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Create a new vocabulary collection
 * @param collectionData - The collection data to create
 * @returns Promise<CreateCollectionResponse>
 */
export async function createVocabularyCollection(
  collectionData: CreateCollectionRequest
): Promise<CreateCollectionResponse> {
  console.log('📝 Creating vocabulary collection:', collectionData.title);
  
  try {
    const response = await fetchWithAuth(API_BASE, {
      method: 'POST',
      body: JSON.stringify(collectionData)
    });
    
    const result = await handleApiResponse<CreateCollectionResponse>(response);
    
    console.log(`✅ Created vocabulary collection with ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to create vocabulary collection:', error);
    throw error;
  }
}

/**
 * Update a vocabulary collection's metadata
 * @param collectionId - The collection ID
 * @param updates - The updates to apply
 * @returns Promise<UpdateCollectionResponse>
 */
export async function updateVocabularyCollection(
  collectionId: number,
  updates: UpdateCollectionRequest
): Promise<UpdateCollectionResponse> {
  console.log(`✏️ Updating vocabulary collection: ${collectionId}`, updates);
  
  try {
    const url = `${API_BASE}/${collectionId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    const result = await handleApiResponse<UpdateCollectionResponse>(response);
    
    console.log(`✅ Updated vocabulary collection: ${result.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update vocabulary collection ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Delete a vocabulary collection
 * @param collectionId - The collection ID to delete
 * @returns Promise<DeleteCollectionResponse>
 */
export async function deleteVocabularyCollection(
  collectionId: number
): Promise<DeleteCollectionResponse> {
  console.log(`🗑️ Deleting vocabulary collection: ${collectionId}`);
  
  try {
    const url = `${API_BASE}/${collectionId}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<DeleteCollectionResponse>(response);
    
    console.log(`✅ Deleted vocabulary collection: ${collectionId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete vocabulary collection ${collectionId}:`, error);
    throw error;
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Check if a collection belongs to the current user
 * @param collection - The collection to check
 * @param userId - The current user ID
 * @returns boolean
 */
export function isMyCollection(collection: VocabularyCollection, userId: string): boolean {
  // Note: This would need to be implemented based on how user ownership is tracked
  // For now, we'll assume the API handles ownership validation
  return true; // Placeholder - implement based on your user system
}

/**
 * Filter collections by type
 * @param collections - Array of collections
 * @param isPublic - Filter for public/private collections
 * @returns VocabularyCollection[]
 */
export function filterCollectionsByVisibility(
  collections: VocabularyCollection[],
  isPublic: boolean
): VocabularyCollection[] {
  return collections.filter(collection => collection.isPublic === isPublic);
}

/**
 * Sort collections by creation date (newest first)
 * @param collections - Array of collections
 * @returns VocabularyCollection[]
 */
export function sortCollectionsByDate(
  collections: VocabularyCollection[]
): VocabularyCollection[] {
  return [...collections].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Search collections by title or description
 * @param collections - Array of collections
 * @param query - Search query
 * @returns VocabularyCollection[]
 */
export function searchCollections(
  collections: VocabularyCollection[],
  query: string
): VocabularyCollection[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return collections;
  
  return collections.filter(collection => 
    collection.title.toLowerCase().includes(searchTerm) ||
    (collection.description && collection.description.toLowerCase().includes(searchTerm))
  );
}

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export const vocabularyApi = {
  // Main CRUD operations
  getCollections: getVocabularyCollections,
  getCollection: getVocabularyCollection,
  createCollection: createVocabularyCollection,
  updateCollection: updateVocabularyCollection,
  deleteCollection: deleteVocabularyCollection,
  
  // Convenience methods
  getPublicCollections: getPublicVocabularyCollections,
  getMyCollections: getMyVocabularyCollections,
  
  // Utility functions
  isMyCollection,
  filterByVisibility: filterCollectionsByVisibility,
  sortByDate: sortCollectionsByDate,
  search: searchCollections,
  
  // Error class
  VocabularyApiError: VocabularyApiErrorImpl
};

// Default export for backward compatibility
export default vocabularyApi;
