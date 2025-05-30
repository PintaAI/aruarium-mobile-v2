import { Platform } from 'react-native';
import { fetchWithAuth } from '../auth';
import { API_BASE_URL } from '../config';
import {
  ApiResponse,
  Course,
  CourseWithModules,
  CreateCourseRequest,
  CreateCourseResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
  DeleteCourseResponse,
  JoinCourseResponse,
  GetCoursesParams,
  CourseApiError
} from './types';

// API endpoint for course operations
const API_BASE = `${API_BASE_URL}/api/mobile/courses`;

/**
 * Custom error class for course API errors
 */
class CourseApiErrorImpl extends Error implements CourseApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'CourseApiError';
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
    const error = new CourseApiErrorImpl(
      data.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.status.toString()
    );
    console.error('🚨 Course API Error:', {
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
// COURSE API FUNCTIONS
// =============================================================================

/**
 * Get all courses with optional filtering
 * @param params - Optional filtering parameters
 * @returns Promise<Course[]>
 */
export async function getCourses(
  params: GetCoursesParams = {}
): Promise<Course[]> {
  console.log('📚 Fetching courses...', params);
  
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}${queryString}`;
    
    const response = await fetchWithAuth(url);
    const courses = await handleApiResponse<Course[]>(response);
    
    console.log(`✅ Retrieved ${courses.length} courses`);
    return courses;
  } catch (error) {
    console.error('❌ Failed to fetch courses:', error);
    throw error;
  }
}

/**
 * Get available courses only (not locked)
 * @returns Promise<Course[]>
 */
export async function getAvailableCourses(): Promise<Course[]> {
  return getCourses({ available: true });
}

/**
 * Get user's authored courses only
 * @returns Promise<Course[]>
 */
export async function getMyCourses(): Promise<Course[]> {
  return getCourses({ mine: true });
}

/**
 * Get courses user has joined
 * @returns Promise<Course[]>
 */
export async function getJoinedCourses(): Promise<Course[]> {
  return getCourses({ joined: true });
}

/**
 * Get courses by level
 * @param level - Course level filter
 * @returns Promise<Course[]>
 */
export async function getCoursesByLevel(
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): Promise<Course[]> {
  return getCourses({ level });
}

/**
 * Get a specific course with its modules
 * @param courseId - The course ID
 * @returns Promise<CourseWithModules>
 */
export async function getCourse(
  courseId: number
): Promise<CourseWithModules> {
  console.log(`📖 Fetching course: ${courseId}`);
  
  try {
    const url = `${API_BASE}/${courseId}`;
    const response = await fetchWithAuth(url);
    const course = await handleApiResponse<CourseWithModules>(response);
    
    console.log(`✅ Retrieved course: ${course.title} with ${course.modules.length} modules`);
    return course;
  } catch (error) {
    console.error(`❌ Failed to fetch course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Create a new course
 * @param courseData - The course data to create
 * @returns Promise<CreateCourseResponse>
 */
export async function createCourse(
  courseData: CreateCourseRequest
): Promise<CreateCourseResponse> {
  console.log('📝 Creating course:', courseData.title);
  
  try {
    const response = await fetchWithAuth(API_BASE, {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
    
    const result = await handleApiResponse<CreateCourseResponse>(response);
    
    console.log(`✅ Created course with ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to create course:', error);
    throw error;
  }
}

/**
 * Update a course's metadata
 * @param courseId - The course ID
 * @param updates - The updates to apply
 * @returns Promise<UpdateCourseResponse>
 */
export async function updateCourse(
  courseId: number,
  updates: UpdateCourseRequest
): Promise<UpdateCourseResponse> {
  console.log(`✏️ Updating course: ${courseId}`, updates);
  
  try {
    const url = `${API_BASE}/${courseId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    const result = await handleApiResponse<UpdateCourseResponse>(response);
    
    console.log(`✅ Updated course: ${result.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to update course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Delete a course
 * @param courseId - The course ID to delete
 * @returns Promise<DeleteCourseResponse>
 */
export async function deleteCourse(
  courseId: number
): Promise<DeleteCourseResponse> {
  console.log(`🗑️ Deleting course: ${courseId}`);
  
  try {
    const url = `${API_BASE}/${courseId}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<DeleteCourseResponse>(response);
    
    console.log(`✅ Deleted course: ${courseId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Join a course
 * @param courseId - The course ID to join
 * @returns Promise<JoinCourseResponse>
 */
export async function joinCourse(
  courseId: number
): Promise<JoinCourseResponse> {
  console.log(`🚪 Joining course: ${courseId}`);
  
  try {
    const url = `${API_BASE}/${courseId}/join`;
    const response = await fetchWithAuth(url, {
      method: 'POST'
    });
    
    const result = await handleApiResponse<JoinCourseResponse>(response);
    
    console.log(`✅ Joined course: ${courseId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to join course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Leave a course
 * @param courseId - The course ID to leave
 * @returns Promise<JoinCourseResponse>
 */
export async function leaveCourse(
  courseId: number
): Promise<JoinCourseResponse> {
  console.log(`🚪 Leaving course: ${courseId}`);
  
  try {
    const url = `${API_BASE}/${courseId}/join`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    const result = await handleApiResponse<JoinCourseResponse>(response);
    
    console.log(`✅ Left course: ${courseId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to leave course ${courseId}:`, error);
    throw error;
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Check if a course belongs to the current user
 * @param course - The course to check
 * @param userId - The current user ID
 * @returns boolean
 */
export function isMyCourse(course: Course, userId: string): boolean {
  return course.author.id === userId;
}

/**
 * Filter courses by level
 * @param courses - Array of courses
 * @param level - Course level
 * @returns Course[]
 */
export function filterCoursesByLevel(
  courses: Course[],
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): Course[] {
  return courses.filter(course => course.level === level);
}

/**
 * Filter courses by join status
 * @param courses - Array of courses
 * @param isJoined - Join status filter
 * @returns Course[]
 */
export function filterCoursesByJoinStatus(
  courses: Course[],
  isJoined: boolean
): Course[] {
  return courses.filter(course => course.isJoined === isJoined);
}

/**
 * Sort courses by creation date (newest first)
 * @param courses - Array of courses
 * @returns Course[]
 */
export function sortCoursesByDate(
  courses: Course[]
): Course[] {
  return [...courses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Search courses by title or description
 * @param courses - Array of courses
 * @param query - Search query
 * @returns Course[]
 */
export function searchCourses(
  courses: Course[],
  query: string
): Course[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return courses;
  
  return courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    (course.description && course.description.toLowerCase().includes(searchTerm))
  );
}

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export const courseApi = {
  // Main CRUD operations
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Join/Leave operations
  joinCourse,
  leaveCourse,
  
  // Convenience methods
  getAvailableCourses,
  getMyCourses,
  getJoinedCourses,
  getCoursesByLevel,
  
  // Utility functions
  isMyCourse,
  filterByLevel: filterCoursesByLevel,
  filterByJoinStatus: filterCoursesByJoinStatus,
  sortByDate: sortCoursesByDate,
  search: searchCourses,
  
  // Error class
  CourseApiError: CourseApiErrorImpl
};

// Default export for backward compatibility
export default courseApi;
