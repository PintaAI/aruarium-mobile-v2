import { ApiResponse } from './types';
import { Platform } from 'react-native';

export type VocabularyType = 'WORD' | 'SENTENCE';

export interface VocabularyItem {
  id: number;
  korean: string;
  indonesian: string;
  type: VocabularyType;
  isChecked: boolean;
  collectionId: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyCollection {
  id: number;
  title: string;
  description?: string;
  icon: string;
  isPublic: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  items: VocabularyItem[];
}

// Development URLs for different environments
const DEV_URL = Platform.select({
  android: 'http://10.0.2.2:3000',         // Android emulator
  ios: 'http://192.168.15.20:3000',        // iOS real device with Expo Go
  default: 'http://localhost:3000'          // iOS simulator
});

const API_PATH = '/api/mobile/vocab';
const BASE_URL = `${DEV_URL}${API_PATH}`;

export async function getVocabularyCollections(type?: VocabularyType) {
  const url = type ? `${BASE_URL}?type=${type}` : BASE_URL;
  const response = await fetch(url);
  const data: ApiResponse<VocabularyCollection[]> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch vocabulary collections');
  }
  
  return data.data;
}

export async function getCollectionItems(collectionId: number, type?: VocabularyType) {
  const params = new URLSearchParams();
  params.append('collectionId', collectionId.toString());
  if (type) {
    params.append('type', type);
  }
  
  const url = `${BASE_URL}?${params.toString()}`;
  const response = await fetch(url);
  const data: ApiResponse<VocabularyItem[]> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch collection items');
  }
  
  return data.data;
}

export async function searchVocabulary(query: string) {
  const url = `${BASE_URL}?search=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data: ApiResponse<VocabularyItem[]> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to search vocabulary');
  }
  
  return data.data;
}
