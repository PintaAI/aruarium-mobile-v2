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

// Vocabulary Request Types
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

// Vocabulary Response Types
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

// Vocabulary API Query Types
export interface GetCollectionsParams {
  publicOnly?: boolean;
  mine?: boolean;
}

// Course Types
export interface CourseAuthor {
  id: string;
  name: string | null;
  email: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  jsonDescription?: string | null;
  htmlDescription?: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string | null;
  icon: string | null;
  isCompleted: boolean;
  isLocked: boolean;
  author: CourseAuthor;
  isJoined: boolean;
  totalMembers: number;
  totalModules: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithModules extends Course {
  modules: CourseModule[];
}

// Course Request Types
export interface CreateCourseRequest {
  title: string;
  description?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
  icon?: string;
  isLocked?: boolean;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
  icon?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
}

// Course Response Types
export interface CreateCourseResponse {
  id: number;
  message: string;
}

export interface UpdateCourseResponse {
  id: number;
  title: string;
  description: string | null;
  level: string;
  isLocked: boolean;
  updatedAt: string;
  message: string;
}

export interface DeleteCourseResponse {
  message: string;
}

export interface JoinCourseResponse {
  message: string;
}

// Course API Query Types
export interface GetCoursesParams {
  mine?: boolean;
  joined?: boolean;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  available?: boolean;
}

// Module Types
export interface ModuleDetail {
  id: number;
  title: string;
  description: string;
  jsonDescription: string;
  htmlDescription: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  courseId: number;
  course: {
    id: number;
    title: string;
  };
  userCompletion: {
    isCompleted: boolean;
    completedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// Module Request Types
export interface UpdateModuleCompletionRequest {
  isCompleted: boolean;
}

// Module Response Types
export interface UpdateModuleCompletionResponse {
  moduleId: number;
  isCompleted: boolean;
  updatedAt: string;
  message: string;
}

// Error Types
export interface VocabularyApiError extends Error {
  status?: number;
  code?: string;
}

export interface CourseApiError extends Error {
  status?: number;
  code?: string;
}

export interface ModuleApiError extends Error {
  status?: number;
  code?: string;
}
