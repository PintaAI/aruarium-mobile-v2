import { Platform } from 'react-native';
import { fetchWithAuth } from '../auth';
import { API_BASE_URL } from '../config';
import {
  ApiResponse,
  KoleksiSoal,
  KoleksiSoalWithSoals,
  Soal,
  Opsi,
  CreateKoleksiSoalRequest,
  CreateKoleksiSoalResponse,
  UpdateKoleksiSoalRequest,
  UpdateKoleksiSoalResponse,
  DeleteKoleksiSoalResponse,
  CreateSoalRequest,
  CreateSoalResponse,
  UpdateSoalRequest,
  UpdateSoalResponse,
  DeleteSoalResponse,
  CreateOpsiRequest,
  CreateOpsiResponse,
  UpdateOpsiRequest,
  UpdateOpsiResponse,
  DeleteOpsiResponse,
  GetKoleksiSoalsParams,
  GetSoalsParams,
  GetKoleksiSoalParams,
  GetSoalParams,
  KoleksiSoalApiError
} from './types';

// API endpoint for koleksi soal operations
const API_BASE = `${API_BASE_URL}/api/mobile`;

/**
 * Custom error class for koleksi soal API errors
 */
class KoleksiSoalApiErrorImpl extends Error implements KoleksiSoalApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'KoleksiSoalApiError';
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
    const error = new KoleksiSoalApiErrorImpl(
      data.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.status.toString()
    );
    console.error('🚨 Koleksi Soal API Error:', {
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
// KOLEKSI SOAL API FUNCTIONS
// =============================================================================

/**
 * Get all koleksi soal with optional filtering
 * @param params - Optional filtering parameters
 * @returns Promise<KoleksiSoal[]>
 */
export async function getKoleksiSoals(
  params: GetKoleksiSoalsParams = {}
): Promise<KoleksiSoal[]> {
  console.log('📚 Fetching koleksi soals...', params);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}/koleksi-soal${queryString}`;
    
    const response = await fetchWithAuth(url);
    const koleksiSoals = await handleApiResponse<KoleksiSoal[]>(response);
    
    console.log(`✅ Retrieved ${koleksiSoals.length} koleksi soals`);
    return koleksiSoals;
  } catch (error) {
    console.error('❌ Failed to fetch koleksi soals:', error);
    throw error;
  }
}

/**
 * Get public koleksi soals only
 * @returns Promise<KoleksiSoal[]>
 */
export async function getPublicKoleksiSoals(): Promise<KoleksiSoal[]> {
  return getKoleksiSoals({ publicOnly: true });
}

/**
 * Get user's koleksi soals only
 * @returns Promise<KoleksiSoal[]>
 */
export async function getMyKoleksiSoals(): Promise<KoleksiSoal[]> {
  return getKoleksiSoals({ mine: true });
}

/**
 * Get a specific koleksi soal with optional questions
 * @param koleksiId - The koleksi soal ID
 * @param params - Optional parameters
 * @returns Promise<KoleksiSoalWithSoals>
 */
export async function getKoleksiSoal(
  koleksiId: number,
  params: GetKoleksiSoalParams = {}
): Promise<KoleksiSoalWithSoals> {
  console.log(`📖 Fetching koleksi soal: ${koleksiId}`);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}/koleksi-soal/${koleksiId}${queryString}`;
    const response = await fetchWithAuth(url);
    const koleksiSoal = await handleApiResponse<KoleksiSoalWithSoals>(response);
    
    console.log(`✅ Retrieved koleksi soal: ${koleksiSoal.nama} with ${koleksiSoal.soals?.length || 0} soals`);
    return koleksiSoal;
  } catch (error) {
    console.error(`❌ Failed to fetch koleksi soal ${koleksiId}:`, error);
    throw error;
  }
}

/**
 * Create a new koleksi soal
 * @param koleksiData - The koleksi soal data to create
 * @returns Promise<CreateKoleksiSoalResponse>
 */
export async function createKoleksiSoal(
  koleksiData: CreateKoleksiSoalRequest
): Promise<CreateKoleksiSoalResponse> {
  console.log('📝 Creating koleksi soal:', koleksiData.nama);
  
  try {
    const response = await fetchWithAuth(`${API_BASE}/koleksi-soal`, {
      method: 'POST',
      body: JSON.stringify(koleksiData)
    });
    
    const result = await handleApiResponse<CreateKoleksiSoalResponse>(response);
    
    console.log(`✅ Created koleksi soal with ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to create koleksi soal:', error);
    throw error;
  }
}

/**
 * Update a koleksi soal's metadata
 * @param koleksiId - The koleksi soal ID
 * @param updates - The updates to apply
 * @returns Promise<UpdateKoleksiSoalResponse>
 */
export async function updateKoleksiSoal(
  koleksiId: number,
  updates: UpdateKoleksiSoalRequest
): Promise<UpdateKoleksiSoalResponse> {
  console.log(`✏️ Updating koleksi soal: ${koleksiId}`, updates);
  
  try {
    const url = `${API_BASE}/koleksi-soal/${koleksiId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    const result = await handleApiResponse<UpdateKoleksiSoalResponse>(response);
    
    console.log(`✅ Updated koleksi soal: ${result.nama}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update koleksi soal ${koleksiId}:`, error);
    throw error;
  }
}

/**
 * Delete a koleksi soal
 * @param koleksiId - The koleksi soal ID to delete
 * @returns Promise<DeleteKoleksiSoalResponse>
 */
export async function deleteKoleksiSoal(
  koleksiId: number
): Promise<DeleteKoleksiSoalResponse> {
  console.log(`🗑️ Deleting koleksi soal: ${koleksiId}`);
  
  try {
    const url = `${API_BASE}/koleksi-soal/${koleksiId}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<DeleteKoleksiSoalResponse>(response);
    
    console.log(`✅ Deleted koleksi soal: ${koleksiId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete koleksi soal ${koleksiId}:`, error);
    throw error;
  }
}

// =============================================================================
// SOAL API FUNCTIONS
// =============================================================================

/**
 * Get soals in a koleksi
 * @param koleksiId - The koleksi soal ID
 * @param params - Optional filtering parameters
 * @returns Promise<Soal[]>
 */
export async function getSoals(
  koleksiId: number,
  params: GetSoalsParams = {}
): Promise<Soal[]> {
  console.log(`📚 Fetching soals for koleksi: ${koleksiId}`, params);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}/koleksi-soal/${koleksiId}/soal${queryString}`;
    
    const response = await fetchWithAuth(url);
    const soals = await handleApiResponse<Soal[]>(response);
    
    console.log(`✅ Retrieved ${soals.length} soals`);
    return soals;
  } catch (error) {
    console.error(`❌ Failed to fetch soals for koleksi ${koleksiId}:`, error);
    throw error;
  }
}

/**
 * Get a specific soal with options
 * @param soalId - The soal ID
 * @param params - Optional parameters
 * @returns Promise<Soal>
 */
export async function getSoal(
  soalId: number,
  params: GetSoalParams = {}
): Promise<Soal> {
  console.log(`📖 Fetching soal: ${soalId}`);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}/soal/${soalId}${queryString}`;
    const response = await fetchWithAuth(url);
    const soal = await handleApiResponse<Soal>(response);
    
    console.log(`✅ Retrieved soal: ${soal.pertanyaan.substring(0, 50)}...`);
    return soal;
  } catch (error) {
    console.error(`❌ Failed to fetch soal ${soalId}:`, error);
    throw error;
  }
}

/**
 * Create a new soal in a koleksi
 * @param koleksiId - The koleksi soal ID
 * @param soalData - The soal data to create
 * @returns Promise<CreateSoalResponse>
 */
export async function createSoal(
  koleksiId: number,
  soalData: CreateSoalRequest
): Promise<CreateSoalResponse> {
  console.log(`📝 Creating soal in koleksi: ${koleksiId}`, soalData.pertanyaan);
  
  try {
    const response = await fetchWithAuth(`${API_BASE}/koleksi-soal/${koleksiId}/soal`, {
      method: 'POST',
      body: JSON.stringify(soalData)
    });
    
    const result = await handleApiResponse<CreateSoalResponse>(response);
    
    console.log(`✅ Created soal with ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create soal in koleksi ${koleksiId}:`, error);
    throw error;
  }
}

/**
 * Update a soal
 * @param soalId - The soal ID
 * @param updates - The updates to apply
 * @returns Promise<UpdateSoalResponse>
 */
export async function updateSoal(
  soalId: number,
  updates: UpdateSoalRequest
): Promise<UpdateSoalResponse> {
  console.log(`✏️ Updating soal: ${soalId}`, updates);
  
  try {
    const url = `${API_BASE}/soal/${soalId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    const result = await handleApiResponse<UpdateSoalResponse>(response);
    
    console.log(`✅ Updated soal: ${result.pertanyaan.substring(0, 50)}...`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update soal ${soalId}:`, error);
    throw error;
  }
}

/**
 * Delete a soal
 * @param soalId - The soal ID to delete
 * @returns Promise<DeleteSoalResponse>
 */
export async function deleteSoal(
  soalId: number
): Promise<DeleteSoalResponse> {
  console.log(`🗑️ Deleting soal: ${soalId}`);
  
  try {
    const url = `${API_BASE}/soal/${soalId}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<DeleteSoalResponse>(response);
    
    console.log(`✅ Deleted soal: ${soalId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete soal ${soalId}:`, error);
    throw error;
  }
}

// =============================================================================
// OPSI API FUNCTIONS
// =============================================================================

/**
 * Create a new opsi for a soal
 * @param soalId - The soal ID
 * @param opsiData - The opsi data to create
 * @returns Promise<CreateOpsiResponse>
 */
export async function createOpsi(
  soalId: number,
  opsiData: CreateOpsiRequest
): Promise<CreateOpsiResponse> {
  console.log(`📝 Creating opsi for soal: ${soalId}`, opsiData.opsiText);
  
  try {
    const response = await fetchWithAuth(`${API_BASE}/soal/${soalId}/opsi`, {
      method: 'POST',
      body: JSON.stringify(opsiData)
    });
    
    const result = await handleApiResponse<CreateOpsiResponse>(response);
    
    console.log(`✅ Created opsi with ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create opsi for soal ${soalId}:`, error);
    throw error;
  }
}

/**
 * Update an opsi
 * @param opsiId - The opsi ID
 * @param updates - The updates to apply
 * @returns Promise<UpdateOpsiResponse>
 */
export async function updateOpsi(
  opsiId: number,
  updates: UpdateOpsiRequest
): Promise<UpdateOpsiResponse> {
  console.log(`✏️ Updating opsi: ${opsiId}`, updates);
  
  try {
    const url = `${API_BASE}/opsi/${opsiId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    const result = await handleApiResponse<UpdateOpsiResponse>(response);
    
    console.log(`✅ Updated opsi: ${result.opsiText.substring(0, 50)}...`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update opsi ${opsiId}:`, error);
    throw error;
  }
}

/**
 * Delete an opsi
 * @param opsiId - The opsi ID to delete
 * @returns Promise<DeleteOpsiResponse>
 */
export async function deleteOpsi(
  opsiId: number
): Promise<DeleteOpsiResponse> {
  console.log(`🗑️ Deleting opsi: ${opsiId}`);
  
  try {
    const url = `${API_BASE}/opsi/${opsiId}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<DeleteOpsiResponse>(response);
    
    console.log(`✅ Deleted opsi: ${opsiId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete opsi ${opsiId}:`, error);
    throw error;
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Filter koleksi soals by visibility
 * @param koleksiSoals - Array of koleksi soals
 * @param isPrivate - Filter for private/public collections
 * @returns KoleksiSoal[]
 */
export function filterKoleksiSoalsByVisibility(
  koleksiSoals: KoleksiSoal[],
  isPrivate: boolean
): KoleksiSoal[] {
  return koleksiSoals.filter(koleksi => koleksi.isPrivate === isPrivate);
}

/**
 * Sort koleksi soals by creation date (newest first)
 * @param koleksiSoals - Array of koleksi soals
 * @returns KoleksiSoal[]
 */
export function sortKoleksiSoalsByDate(
  koleksiSoals: KoleksiSoal[]
): KoleksiSoal[] {
  return [...koleksiSoals].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Search koleksi soals by name or description
 * @param koleksiSoals - Array of koleksi soals
 * @param query - Search query
 * @returns KoleksiSoal[]
 */
export function searchKoleksiSoals(
  koleksiSoals: KoleksiSoal[],
  query: string
): KoleksiSoal[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return koleksiSoals;
  
  return koleksiSoals.filter(koleksi => 
    koleksi.nama.toLowerCase().includes(searchTerm) ||
    (koleksi.deskripsi && koleksi.deskripsi.toLowerCase().includes(searchTerm))
  );
}

/**
 * Filter soals by difficulty
 * @param soals - Array of soals
 * @param difficulty - Difficulty level
 * @returns Soal[]
 */
export function filterSoalsByDifficulty(
  soals: Soal[],
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): Soal[] {
  return soals.filter(soal => soal.difficulty === difficulty);
}

/**
 * Get correct answers for a soal
 * @param soal - The soal object
 * @returns Opsi[]
 */
export function getCorrectAnswers(soal: Soal): Opsi[] {
  return soal.opsis.filter(opsi => opsi.isCorrect);
}

/**
 * Check if a soal has correct answers
 * @param soal - The soal object
 * @returns boolean
 */
export function hasCorrectAnswers(soal: Soal): boolean {
  return soal.opsis.some(opsi => opsi.isCorrect);
}

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export const koleksiSoalApi = {
  // Koleksi Soal CRUD operations
  getKoleksiSoals,
  getKoleksiSoal,
  createKoleksiSoal,
  updateKoleksiSoal,
  deleteKoleksiSoal,
  
  // Convenience methods for Koleksi Soal
  getPublicKoleksiSoals,
  getMyKoleksiSoals,
  
  // Soal CRUD operations
  getSoals,
  getSoal,
  createSoal,
  updateSoal,
  deleteSoal,
  
  // Opsi CRUD operations
  createOpsi,
  updateOpsi,
  deleteOpsi,
  
  // Utility functions
  filterByVisibility: filterKoleksiSoalsByVisibility,
  sortByDate: sortKoleksiSoalsByDate,
  search: searchKoleksiSoals,
  filterSoalsByDifficulty,
  getCorrectAnswers,
  hasCorrectAnswers,
  
  // Error class
  KoleksiSoalApiError: KoleksiSoalApiErrorImpl
};

// Default export for backward compatibility
export default koleksiSoalApi;
