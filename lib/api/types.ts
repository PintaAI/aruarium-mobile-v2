export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Vocabulary Types
export interface VocabularyItem {
  id: number;
  korean: string;
  indonesian: string;
  isChecked: boolean;
  type: 'WORD' | 'SENTENCE';
  createdAt: string;
  updatedAt: string;
  collectionId?: number;
}

export interface VocabularyCollection {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  itemsCount?: number;
  createdAt: string;
  updatedAt: string;
  items?: VocabularyItem[];
}

export interface VocabularyCollectionWithItems extends VocabularyCollection {
  items: VocabularyItem[];
}

// Request Types
export interface CreateCollectionRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateCollectionRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

// Response Types
export interface CreateCollectionResponse {
  id: number;
  message: string;
}

export interface UpdateCollectionResponse {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  updatedAt: string;
  message: string;
}

export interface DeleteCollectionResponse {
  message: string;
}

// API Query Types
export interface GetCollectionsParams {
  publicOnly?: boolean;
  mine?: boolean;
}

// Error Types
export interface VocabularyApiError extends Error {
  status?: number;
  code?: string;
}
