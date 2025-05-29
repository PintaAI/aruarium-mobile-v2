# Vocabulary API Documentation

This document provides comprehensive documentation for the vocabulary API module (`mobile/lib/api/vocabulary.ts`), which handles all vocabulary collection operations in the mobile app.

## Overview

The vocabulary API module provides a complete interface for managing vocabulary collections, including CRUD operations, filtering, searching, and utility functions. It uses authenticated requests and automatic error handling.

## Dependencies

- `react-native`: Platform detection utilities
- `../auth`: Authentication utilities (`fetchWithAuth`)
- `../config`: Environment configuration (`API_BASE_URL`)
- `./types`: TypeScript type definitions

## API Endpoint

All vocabulary operations use the base endpoint:
```
{API_BASE_URL}/api/mobile/vocabulary
```

## Error Handling

### VocabularyApiError

Custom error class that extends the standard Error with additional properties:

```typescript
class VocabularyApiError extends Error {
  status?: number;    // HTTP status code
  code?: string;      // Error code
  name: string;       // Always 'VocabularyApiError'
}
```

### Error Response Handling

All API responses are processed through `handleApiResponse<T>()` which:
- Parses JSON responses
- Checks for success status
- Throws `VocabularyApiError` on failures
- Logs detailed error information

## Core API Functions

### Collection Retrieval

#### `getVocabularyCollections(params?)`

Retrieves vocabulary collections with optional filtering.

```typescript
async function getVocabularyCollections(
  params: GetCollectionsParams = {}
): Promise<VocabularyCollection[]>
```

**Parameters:**
- `params` (optional): Filtering parameters
  - `publicOnly?: boolean` - Get only public collections
  - `mine?: boolean` - Get only user's collections
  - Additional parameters as defined in `GetCollectionsParams`

**Returns:** Array of vocabulary collections

**Example:**
```typescript
// Get all collections
const allCollections = await getVocabularyCollections();

// Get only public collections
const publicCollections = await getVocabularyCollections({ publicOnly: true });

// Get user's collections
const myCollections = await getVocabularyCollections({ mine: true });
```

#### `getPublicVocabularyCollections()`

Convenience function to get only public collections.

```typescript
async function getPublicVocabularyCollections(): Promise<VocabularyCollection[]>
```

**Example:**
```typescript
const publicCollections = await getPublicVocabularyCollections();
```

#### `getMyVocabularyCollections()`

Convenience function to get user's collections.

```typescript
async function getMyVocabularyCollections(): Promise<VocabularyCollection[]>
```

**Example:**
```typescript
const myCollections = await getMyVocabularyCollections();
```

#### `getVocabularyCollection(collectionId)`

Retrieves a specific collection with all its vocabulary items.

```typescript
async function getVocabularyCollection(
  collectionId: number
): Promise<VocabularyCollectionWithItems>
```

**Parameters:**
- `collectionId`: The unique identifier of the collection

**Returns:** Collection object with embedded vocabulary items

**Example:**
```typescript
const collection = await getVocabularyCollection(123);
console.log(`${collection.title} has ${collection.items.length} items`);
```

### Collection Management

#### `createVocabularyCollection(collectionData)`

Creates a new vocabulary collection.

```typescript
async function createVocabularyCollection(
  collectionData: CreateCollectionRequest
): Promise<CreateCollectionResponse>
```

**Parameters:**
- `collectionData`: Collection data object
  - `title: string` - Collection title
  - `description?: string` - Optional description
  - `isPublic?: boolean` - Public visibility
  - Additional fields as defined in `CreateCollectionRequest`

**Returns:** Creation response with new collection ID

**Example:**
```typescript
const newCollection = await createVocabularyCollection({
  title: "Korean Food Vocabulary",
  description: "Common Korean food terms",
  isPublic: true
});

console.log(`Created collection with ID: ${newCollection.id}`);
```

#### `updateVocabularyCollection(collectionId, updates)`

Updates a vocabulary collection's metadata.

```typescript
async function updateVocabularyCollection(
  collectionId: number,
  updates: UpdateCollectionRequest
): Promise<UpdateCollectionResponse>
```

**Parameters:**
- `collectionId`: The collection ID to update
- `updates`: Object containing fields to update
  - `title?: string` - New title
  - `description?: string` - New description
  - `isPublic?: boolean` - New visibility setting
  - Additional fields as defined in `UpdateCollectionRequest`

**Returns:** Updated collection data

**Example:**
```typescript
const updated = await updateVocabularyCollection(123, {
  title: "Updated Title",
  description: "New description",
  isPublic: false
});
```

#### `deleteVocabularyCollection(collectionId)`

Deletes a vocabulary collection.

```typescript
async function deleteVocabularyCollection(
  collectionId: number
): Promise<DeleteCollectionResponse>
```

**Parameters:**
- `collectionId`: The collection ID to delete

**Returns:** Deletion confirmation

**Example:**
```typescript
await deleteVocabularyCollection(123);
console.log('Collection deleted successfully');
```

## Utility Functions

### `isMyCollection(collection, userId)`

Checks if a collection belongs to the current user.

```typescript
function isMyCollection(collection: VocabularyCollection, userId: string): boolean
```

**Note:** Currently returns `true` as a placeholder. Implementation needed based on user system.

### `filterCollectionsByVisibility(collections, isPublic)`

Filters collections by public/private visibility.

```typescript
function filterCollectionsByVisibility(
  collections: VocabularyCollection[],
  isPublic: boolean
): VocabularyCollection[]
```

**Example:**
```typescript
const publicCollections = filterCollectionsByVisibility(allCollections, true);
const privateCollections = filterCollectionsByVisibility(allCollections, false);
```

### `sortCollectionsByDate(collections)`

Sorts collections by creation date (newest first).

```typescript
function sortCollectionsByDate(
  collections: VocabularyCollection[]
): VocabularyCollection[]
```

**Example:**
```typescript
const sortedCollections = sortCollectionsByDate(collections);
```

### `searchCollections(collections, query)`

Searches collections by title or description.

```typescript
function searchCollections(
  collections: VocabularyCollection[],
  query: string
): VocabularyCollection[]
```

**Parameters:**
- `collections`: Array of collections to search
- `query`: Search term (case-insensitive)

**Example:**
```typescript
const results = searchCollections(collections, "Korean food");
```

## Export Configurations

### Named Exports

All functions are available as named exports:
```typescript
import {
  getVocabularyCollections,
  createVocabularyCollection,
  // ... other functions
} from './lib/api/vocabulary';
```

### Vocabulary API Object

Organized API object with grouped functions:
```typescript
import { vocabularyApi } from './lib/api/vocabulary';

// Main CRUD operations
await vocabularyApi.getCollections();
await vocabularyApi.createCollection(data);

// Convenience methods
await vocabularyApi.getPublicCollections();
await vocabularyApi.getMyCollections();

// Utility functions
vocabularyApi.filterByVisibility(collections, true);
vocabularyApi.sortByDate(collections);
vocabularyApi.search(collections, "query");
```

### Default Export

Default export for backward compatibility:
```typescript
import vocabularyApi from './lib/api/vocabulary';
```

## Usage Examples

### Basic Collection Management

```typescript
import { vocabularyApi } from './lib/api/vocabulary';

// Create a new collection
const newCollection = await vocabularyApi.createCollection({
  title: "Daily Korean Words",
  description: "Essential vocabulary for daily conversation",
  isPublic: true
});

// Get all public collections
const publicCollections = await vocabularyApi.getPublicCollections();

// Get a specific collection with items
const collection = await vocabularyApi.getCollection(newCollection.id);

// Update collection
await vocabularyApi.updateCollection(newCollection.id, {
  description: "Updated description"
});

// Delete collection
await vocabularyApi.deleteCollection(newCollection.id);
```

### Collection Filtering and Search

```typescript
import {
  getVocabularyCollections,
  filterCollectionsByVisibility,
  sortCollectionsByDate,
  searchCollections
} from './lib/api/vocabulary';

// Get all collections
const allCollections = await getVocabularyCollections();

// Filter and sort
const publicCollections = filterCollectionsByVisibility(allCollections, true);
const sortedCollections = sortCollectionsByDate(publicCollections);

// Search
const searchResults = searchCollections(sortedCollections, "Korean");
```

### Error Handling

```typescript
import { vocabularyApi, VocabularyApiError } from './lib/api/vocabulary';

try {
  const collections = await vocabularyApi.getCollections();
} catch (error) {
  if (error instanceof VocabularyApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
    // Handle specific API errors
  } else {
    console.error('Unexpected error:', error);
    // Handle network or other errors
  }
}
```

## Authentication

All API functions use `fetchWithAuth()` from the auth module, which automatically:
- Adds authorization headers
- Handles token management
- Manages authentication errors

Ensure the user is logged in before calling vocabulary API functions.

## Logging

The module provides comprehensive logging for debugging:
- 📚 Collection fetching operations
- 📖 Individual collection retrieval
- 📝 Collection creation
- ✏️ Collection updates
- 🗑️ Collection deletion
- ✅ Success confirmations
- ❌ Error details

All logs include relevant parameters and results for easy debugging.

## Type Safety

The module is fully typed with TypeScript. Import types as needed:

```typescript
import type {
  VocabularyCollection,
  VocabularyCollectionWithItems,
  CreateCollectionRequest,
  VocabularyApiError
} from './lib/api/types';
```

## Performance Considerations

- Functions return promises for async operations
- Collections are fetched on-demand
- Utility functions operate on local arrays (no API calls)
- Error responses include detailed information for debugging
- Query parameters are properly encoded for URL safety
