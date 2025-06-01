# Koleksi Soal API Documentation

This document describes the mobile API routes for managing question collections (Koleksi Soal), questions (Soal), and options (Opsi).

## Overview

The API follows RESTful conventions and includes authentication via JWT tokens. All endpoints require a valid `Authorization: Bearer <token>` header.

## Base URL
```
/api/mobile
```

## Data Models

### KoleksiSoal (Question Collection)
```typescript
interface KoleksiSoal {
  id: number;
  nama: string;
  deskripsi?: string;
  isPrivate: boolean;
  soalsCount: number;
  tryoutsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Soal (Question)
```typescript
interface Soal {
  id: number;
  koleksiId: number;
  pertanyaan: string;
  attachmentUrl?: string;
  attachmentType?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  explanation?: string;
  isActive: boolean;
  author: {
    id: string;
    name: string;
    email: string;
  };
  opsis: Opsi[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Opsi (Option)
```typescript
interface Opsi {
  id: number;
  soalId: number;
  opsiText: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### KoleksiSoal Routes

#### GET /api/mobile/koleksi-soal
Get all question collections with optional filtering.

**Query Parameters:**
- `mine=true` - Get only user's collections
- `publicOnly=true` - Get only public collections

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Basic Korean Grammar",
      "deskripsi": "Questions about Korean grammar basics",
      "isPrivate": false,
      "soalsCount": 15,
      "tryoutsCount": 2,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/mobile/koleksi-soal
Create a new question collection.

**Request Body:**
```json
{
  "nama": "New Collection",
  "deskripsi": "Optional description",
  "isPrivate": false
}
```

#### GET /api/mobile/koleksi-soal/[id]
Get specific question collection with questions.

**Query Parameters:**
- `includeSoals=false` - Exclude questions from response (default: true)

#### PATCH /api/mobile/koleksi-soal/[id]
Update question collection metadata.

**Request Body:**
```json
{
  "nama": "Updated Collection Name",
  "deskripsi": "Updated description",
  "isPrivate": true
}
```

#### DELETE /api/mobile/koleksi-soal/[id]
Delete question collection (fails if used in tryouts).

### Soal Routes

#### GET /api/mobile/koleksi-soal/[id]/soal
Get questions in a collection.

**Query Parameters:**
- `difficulty=BEGINNER` - Filter by difficulty
- `includeInactive=true` - Include inactive questions
- `includeOpsis=false` - Exclude options from response

#### POST /api/mobile/koleksi-soal/[id]/soal
Add question to collection.

**Request Body:**
```json
{
  "pertanyaan": "What is the capital of Korea?",
  "difficulty": "BEGINNER",
  "explanation": "Seoul is the capital city of South Korea.",
  "attachmentUrl": "https://example.com/image.jpg",
  "attachmentType": "image",
  "opsis": [
    { "opsiText": "Seoul", "isCorrect": true },
    { "opsiText": "Busan", "isCorrect": false },
    { "opsiText": "Incheon", "isCorrect": false },
    { "opsiText": "Daegu", "isCorrect": false }
  ]
}
```

#### GET /api/mobile/soal/[id]
Get specific question with options.

**Query Parameters:**
- `includeOpsis=false` - Exclude options from response

#### PATCH /api/mobile/soal/[id]
Update question (only by author).

**Request Body:**
```json
{
  "pertanyaan": "Updated question text",
  "difficulty": "INTERMEDIATE",
  "explanation": "Updated explanation",
  "isActive": false
}
```

#### DELETE /api/mobile/soal/[id]
Delete question (only by author).

### Opsi Routes

#### POST /api/mobile/soal/[id]/opsi
Add option to question.

**Request Body:**
```json
{
  "opsiText": "Option text",
  "isCorrect": false
}
```

#### PATCH /api/mobile/opsi/[id]
Update option (only by question author).

**Request Body:**
```json
{
  "opsiText": "Updated option text",
  "isCorrect": true
}
```

#### DELETE /api/mobile/opsi/[id]
Delete option (only by question author).

**Restrictions:**
- Cannot delete the last option of a question
- Cannot delete the only correct option of a question

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer your_jwt_token_here',
  'Content-Type': 'application/json'
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Authorization Rules

1. **Question Collections**: Currently no ownership validation (consider adding authorId to schema)
2. **Questions**: Only the author can modify/delete their questions
3. **Options**: Only the question author can modify/delete options
4. **Private Collections**: Access control needs implementation based on business logic

## Usage Examples

### Creating a Complete Question with Options

```javascript
// 1. Create collection
const collection = await fetch('/api/mobile/koleksi-soal', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nama: 'Korean Vocabulary',
    deskripsi: 'Basic Korean vocabulary questions'
  })
});

// 2. Create question with options
const question = await fetch(`/api/mobile/koleksi-soal/${collectionId}/soal`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pertanyaan: 'How do you say "hello" in Korean?',
    difficulty: 'BEGINNER',
    opsis: [
      { opsiText: '안녕하세요', isCorrect: true },
      { opsiText: '감사합니다', isCorrect: false },
      { opsiText: '죄송합니다', isCorrect: false }
    ]
  })
});
```

### Fetching Questions for a Quiz

```javascript
// Get all questions in a collection with options
const response = await fetch(`/api/mobile/koleksi-soal/${collectionId}/soal?difficulty=BEGINNER`, {
  headers: { 'Authorization': 'Bearer token' }
});

const { data: questions } = await response.json();
```

## Testing

Use the provided test script to verify API functionality:

```bash
cd mobile
node test-koleksi-soal-api.js
```

Make sure to update the `authToken` in the test configuration with a valid JWT token.

## Notes

1. **Schema Considerations**: Consider adding `authorId` to KoleksiSoal for proper ownership validation
2. **Cascade Deletes**: Deleting questions will automatically delete their options
3. **Transaction Safety**: Question creation with options uses database transactions
4. **Performance**: Consider adding pagination for large collections
5. **Validation**: All inputs are validated and sanitized before database operations
