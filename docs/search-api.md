# Search API Reference

> **All endpoints require authentication** - Include `Authorization: Bearer <token>` header

## Base URL
```
/api/v1/search
```

---

## 1. Search Autocomplete

Get text suggestions as user types for search input.

### Endpoint
```
GET /api/v1/search/autocomplete
```

### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query (min 2 characters) |
| `limit` | number | No | 5 | Max suggestions per type (max 10) |

### Response
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "actress",
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Actress Name",
        "imageUrl": "https://cdn.example.com/cover.jpg"
      },
      {
        "type": "tag",
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "tag-name"
      }
    ]
  }
}
```

### Suggestion Types
- `actress` - Matched actress profiles (includes cover image)
- `tag` - Matched tags

### Fuzzy Search (pg_trgm)
This endpoint uses PostgreSQL trigram matching for **typo-tolerant search**:
- `"priynka"` → matches `"Priyanka"`
- `"deepka"` → matches `"Deepika"`
- Results sorted by similarity score

---

## 2. Unified Search (Cursor Pagination)

Search across actresses and images. Uses cursor-based pagination for efficient scrolling.

### Endpoint
```
GET /api/v1/search
```

### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query (min 2 characters) |
| `limit` | number | No | 20 | Results per page (max 50) |
| `cursor` | string | No | - | `nextCursor` from previous response |

### Response
```json
{
  "success": true,
  "message": "Search results fetched successfully",
  "data": {
    "query": "search term",
    "actresses": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Actress Name",
        "cover_image_url": "https://cdn.example.com/cover.jpg",
        "popularity_rating": 8.5
      }
    ],
    "images": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "thumbnail_url": "https://cdn.example.com/thumb.jpg",
        "image_url": "https://cdn.example.com/full.jpg",
        "aspect_ratio": 0.75,
        "hotness_rating": 7,
        "likes_count": 150,
        "popularity_score": 85.5,
        "actress": { "id": "...", "name": "Actress Name" }
      }
    ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "nextCursor": "72.3"
    }
  }
}
```

### Pagination Notes
- **First page**: Don't pass `cursor` - returns actresses + first batch of images
- **Next pages**: Pass `nextCursor` from previous response - returns only images
- **Cursor value**: Based on `popularity_score` of last image

---

## 3. Get Recent Searches

Get user's search history. **Requires authentication.**

### Endpoint
```
GET /api/v1/search/recent
```

### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 10 | Max results (max 20) |

### Response
```json
{
  "success": true,
  "data": {
    "searches": [
      { "id": "...", "query": "search term", "searched_at": "2024-01-01T12:00:00Z" }
    ]
  }
}
```

---

## 4. Save Search

Save a search to history. **Requires authentication.**

### Endpoint
```
POST /api/v1/search/recent
```

### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |

### Body
```json
{ "query": "search term" }
```

### Response
```json
{ "success": true, "message": "Search saved" }
```

---

## 5. Clear Recent Searches

Clear all search history for user. **Requires authentication.**

### Endpoint
```
DELETE /api/v1/search/recent
```

### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |

### Response
```json
{ "success": true, "message": "Recent searches cleared" }
```

---

## Error Responses

### Query Too Short
```json
{
  "success": true,
  "message": "Search query too short",
  "data": {
    "actresses": [],
    "images": [],
    "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0, "hasNextPage": false }
  }
}
```

### Server Error
```json
{
  "success": false,
  "message": "Failed to search images",
  "statusCode": 500
}
```
