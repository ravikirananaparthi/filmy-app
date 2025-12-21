# Filmy API Reference v1.0

**Base URL:** `http://localhost:3000/api/v1`

**Last Updated:** 2025-12-19

---

## Table of Contents

1. [Authentication](#authentication)
2. [Onboarding](#onboarding)
3. [Feed](#feed)
4. [Images](#images)
5. [Actresses](#actresses)
6. [Trending](#trending)
7. [Tags](#tags)
8. [Admin](#admin)
9. [Error Codes](#error-codes)
10. [Rate Limiting](#rate-limiting)

---

## Authentication

All authenticated endpoints require a Bearer token in the `Authorization` header.

### Send OTP

Initiate phone authentication by sending an OTP.

**HTTP Method:** `POST`  
**Path:** `/auth/phone/start`  
**Auth Required:** No

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phoneNumber` | string | Yes | Phone number without country code |
| `countryCode` | string | Yes | Country code with + prefix (e.g., "+91") |

#### Request Example

```json
{
  "phoneNumber": "9876543210",
  "countryCode": "+91"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Error Responses

| Code | Message |
|------|---------|
| 400 | Phone number and country code are required |
| 500 | Failed to send OTP |

---

### Verify OTP

Verify OTP and complete authentication.

**HTTP Method:** `POST`  
**Path:** `/auth/phone/verify`  
**Auth Required:** No

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phoneNumber` | string | Yes | Phone number |
| `countryCode` | string | Yes | Country code with + |
| `token` | string | Yes | 6-digit OTP code |

#### Request Example

```json
{
  "phoneNumber": "9876543210",
  "countryCode": "+91",
  "token": "123456"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Phone verified successfully",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "9876543210",
      "countryCode": "+91",
      "preferences": [],
      "favoriteActressIds": [],
      "role": "user",
      "isNewUser": true
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "refresh-token-here"
    }
  }
}
```

#### Error Responses

| Code | Message |
|------|---------|
| 400 | Phone number, country code, and token are required |
| 401 | Invalid OTP |
| 500 | Verification failed |

---

## Onboarding

### Save User Preferences

Save user's tag preferences during onboarding.

**HTTP Method:** `POST`  
**Path:** `/onboarding/preferences`  
**Auth Required:** Yes 🔒

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `preferences` | string[] | Yes | Array of tag names (e.g., ["cute", "beautiful"]) |

#### Request Example

```json
{
  "preferences": ["cute", "beautiful", "bold"]
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Preferences saved successfully",
  "data": {
    "preferences": ["cute", "beautiful", "bold"]
  }
}
```

---

### Follow Actresses

Add actresses to user's favorites during onboarding.

**HTTP Method:** `POST`  
**Path:** `/onboarding/follow`  
**Auth Required:** Yes 🔒

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actressIds` | string[] | Yes | Array of actress UUIDs |

#### Request Example

```json
{
  "actressIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Actresses followed successfully",
  "data": {
    "favoriteActressIds": ["uuid-1", "uuid-2", "uuid-3"]
  }
}
```

---

### Get Suggested Actresses

Get suggested actresses for onboarding based on user preferences.

**HTTP Method:** `GET`  
**Path:** `/onboarding/suggested-actresses`  
**Auth Required:** Yes 🔒

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Number of actresses to return |

#### Request Example

```
GET /api/v1/onboarding/suggested-actresses?limit=20
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "actresses": [
      {
        "id": "uuid",
        "name": "Emma Watson",
        "cover_image_url": "https://...",
        "popularity_rating": 95,
        "hotness_rating": 9
      }
    ]
  }
}
```

---

## Feed

> **⚡ Performance v3:** All feed endpoints now use **Node.js-based scoring** with fast PostgreSQL candidate queries. Expected latency: **<200ms** (previously ~18s for personalized feeds).

> **🔑 Important:** All feed endpoints require authentication. Tags are sent as **UUIDs** (not names).

---

### Get Default Feed

Main feed sorted by popularity score with filters.

**HTTP Method:** `GET`  
**Path:** `/feed/default`  
**Auth Required:** Yes 🔒

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Images per page (max: 50) |
| `cursor` | string | No | - | JSON cursor: `{"score":85,"id":"uuid"}` |
| `tags` | string | No | - | Comma-separated **tag UUIDs** |
| `minHotness` | integer | No | - | Minimum hotness (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness (1-10) |
| `excludeViewed` | boolean | No | false | Hide viewed images |

#### Request Example

```
GET /api/v1/feed/default?limit=20&excludeViewed=true&minHotness=7
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Feed fetched successfully",
  "data": {
    "images": [
      {
        "id": "uuid",
        "image_url": "https://...",
        "thumbnail_url": "https://...",
        "blurhash": "LKO2?U%2Tw=w]~RBVZRi}",
        "aspect_ratio": 0.75,
        "hotness_rating": 8,
        "likes_count": 150,
        "downloads_count": 45,
        "popularity_score": 87.5,
        "created_at": "2024-12-18T10:00:00Z",
        "isUserLiked": true,
        "actress": {
          "id": "uuid",
          "name": "Kajal Aggarwal",
          "cover_image_url": "https://..."
        }
      }
    ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "nextCursor": { "score": 85.2, "id": "uuid-123" }
    }
  }
}
```

---

### Get For You Feed (Personalized)

Personalized feed using actress + tag preferences. Automatically excludes viewed images.

**HTTP Method:** `GET`  
**Path:** `/feed/for-you`  
**Auth Required:** Yes 🔒

#### Personalization Formula

```
personalizedScore = baseScore + actressBoost + tagBoost + recencyBoost

Where:
- actressBoost = +50 if actress in user's favorite_actress_ids
- tagBoost = +10 × (matching tags with user's preferred_tag_ids)
- recencyBoost = +20 if image < 7 days old
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Images per page |
| `cursor` | string | No | - | JSON cursor for pagination |

#### Request Example

```
GET /api/v1/feed/for-you?limit=20
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Personalized feed fetched successfully",
  "data": {
    "images": [
      {
        "id": "uuid",
        "image_url": "https://...",
        "popularity_score": 87.5,
        "personalized_score": 157.5,
        "isUserLiked": false,
        "actress": { "id": "uuid", "name": "Kajal Aggarwal", "cover_image_url": "..." }
      }
    ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "nextCursor": { "score": 85.2, "id": "uuid-123" }
    }
  }
}
```

---

### Get Fresh Feed (Latest)

Latest images sorted by creation date.

**HTTP Method:** `GET`  
**Path:** `/feed/fresh`  
**Auth Required:** Yes 🔒

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Images per page |
| `cursor` | string | No | - | JSON cursor (timestamp-based) |
| `tags` | string | No | - | Comma-separated **tag UUIDs** |
| `minHotness` | integer | No | - | Minimum hotness (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness (1-10) |
| `excludeViewed` | boolean | No | false | Hide viewed images |

#### Request Example

```
GET /api/v1/feed/fresh?limit=20&tags=uuid1,uuid2
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Fresh feed fetched successfully",
  "data": {
    "images": [ /* images sorted by created_at DESC */ ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "nextCursor": { "score": 1702900000000, "id": "uuid-123" }
    }
  }
}
```

---

### Get Magic Shuffle (Seeded Random)

Randomized feed with **seeded pagination** for consistent infinite scroll.

**HTTP Method:** `GET`  
**Path:** `/feed/magic-shuffle`  
**Auth Required:** Yes 🔒

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Number of images |
| `seed` | string | No | auto | Session seed for consistent order |
| `cursorHash` | string | No | - | Hash cursor from `nextCursorHash` |
| `tags` | string | No | - | Comma-separated **tag UUIDs** |
| `minHotness` | integer | No | - | Minimum hotness (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness (1-10) |

#### Pagination Flow

1. **First request:** Omit `seed` and `cursorHash`
2. **Next pages:** Pass `seed` and `cursorHash` from previous response

#### Request Examples

```
# First page
GET /api/v1/feed/magic-shuffle?limit=20

# Second page (with seed from response)
GET /api/v1/feed/magic-shuffle?limit=20&seed=abc123&cursorHash=d41d8cd98f...
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Magic shuffle fetched successfully",
  "data": {
    "images": [ /* seeded random images */ ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "seed": "abc123",
      "nextCursorHash": "d41d8cd98f00b204..."
    }
  }
}
```

---

### Get Blend Feed (Favorites)

Images from user's favorite actresses (uses `favorite_actress_ids`).

**HTTP Method:** `GET`  
**Path:** `/feed/blend`  
**Auth Required:** Yes 🔒

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Images per page |
| `cursor` | string | No | - | JSON cursor for pagination |
| `tags` | string | No | - | Comma-separated **tag UUIDs** |
| `minHotness` | integer | No | - | Minimum hotness (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness (1-10) |

#### Request Example

```
GET /api/v1/feed/blend?limit=20
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Blend feed fetched successfully",
  "data": {
    "images": [ /* images from favorite actresses */ ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "nextCursor": { "score": 85.2, "id": "uuid-123" }
    }
  }
}
```

---

### Create Custom Blend (Seeded Random)

Custom blend from specific actresses with **seeded pagination**.

**HTTP Method:** `POST`  
**Path:** `/feed/custom-blend`  
**Auth Required:** Yes 🔒

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actressIds` | string[] | Yes | Array of actress UUIDs (2-10) |
| `limit` | integer | No | Images to return (default: 20) |
| `seed` | string | No | Session seed for consistent order |
| `cursorHash` | string | No | Hash cursor from `nextCursorHash` |
| `tags` | string[] | No | Array of **tag UUIDs** |
| `minHotness` | integer | No | Minimum hotness (1-10) |
| `maxHotness` | integer | No | Maximum hotness (1-10) |

#### Request Example (First page)

```json
{
  "actressIds": ["uuid-1", "uuid-2"],
  "limit": 20,
  "minHotness": 7
}
```

#### Pagination Request (page 2+)

```json
{
  "actressIds": ["uuid-1", "uuid-2"],
  "limit": 20,
  "seed": "abc123",
  "cursorHash": "d41d8cd98f00b204..."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Custom blend fetched successfully",
  "data": {
    "images": [ /* seeded random images */ ],
    "actresses": [
      { "id": "uuid-1", "name": "Kajal Aggarwal" },
      { "id": "uuid-2", "name": "Bhagyashri Borse" }
    ],
    "pagination": {
      "limit": 20,
      "hasNextPage": true,
      "seed": "abc123",
      "nextCursorHash": "f47ac10b58cc4372..."
    }
  }
}
```

---

## Images

### List Images

Get paginated list of images with optional filtering.

**HTTP Method:** `GET`  
**Path:** `/images`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 20 | Images per page (max: 50) |
| `actressId` | string | No | - | Filter by actress UUID |
| `tags` | string | No | - | Comma-separated tag names |
| `minHotness` | integer | No | - | Minimum hotness rating (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness rating (1-10) |

#### Request Example

```
GET /api/v1/images?page=1&limit=20&actressId=uuid&tags=cute&minHotness=7
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "images": [ /* array of image objects */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Single Image

Get detailed information about a specific image.

**HTTP Method:** `GET`  
**Path:** `/images/:id`  
**Auth Required:** No

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
GET /api/v1/images/uuid-123
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "image_url": "https://...",
    "thumbnail_url": "https://...",
    "width": 1920,
    "height": 1080,
    "aspect_ratio": 1.7778,
    "file_size": 756450,
    "format": "webp",
    "blurhash": "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    "hotness_rating": 8,
    "tags": ["cute", "beach"],
    "actress": {
      "id": "uuid",
      "name": "Emma Watson"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Track View 🆕

Track when user opens image detail view (for excludeViewed feature).

**HTTP Method:** `POST`  
**Path:** `/images/:id/view`  
**Auth Required:** Yes 🔒

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
POST /api/v1/images/uuid-123/view
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "View tracked successfully"
}
```

> **Note:** Call this when user opens image detail/fullscreen view. Used for `excludeViewed` feed filtering.

---

### Like Image

Add image to user's liked images. Automatically updates `likes_count` on the image.

**HTTP Method:** `POST`  
**Path:** `/images/:id/like`  
**Auth Required:** Yes 🔒

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
POST /api/v1/images/uuid-123/like
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Image liked successfully"
}
```

---

### Unlike Image

Remove image from user's liked images.

**HTTP Method:** `DELETE`  
**Path:** `/images/:id/like`  
**Auth Required:** Yes 🔒

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
DELETE /api/v1/images/uuid-123/like
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Image unliked successfully"
}
```

---

### Track Download

Track image download for analytics.

**HTTP Method:** `POST`  
**Path:** `/images/:id/download`  
**Auth Required:** Yes 🔒

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
POST /api/v1/images/uuid-123/download
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Download tracked successfully"
}
```

---

### Track Wallpaper Set

Track when user sets image as wallpaper for analytics.

**HTTP Method:** `POST`  
**Path:** `/images/:id/wallpaper`  
**Auth Required:** Yes 🔒

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
POST /api/v1/images/uuid-123/wallpaper
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Wallpaper set tracked successfully"
}
```

---

## Actresses

### List Actresses

Get paginated list of actresses.

**HTTP Method:** `GET`  
**Path:** `/actresses`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 20 | Actresses per page (max: 50) |
| `sortBy` | string | No | popularity | Sort by: "popularity", "recent", "name" |

#### Request Example

```
GET /api/v1/actresses?page=1&limit=20&sortBy=popularity
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "actresses": [
      {
        "id": "uuid",
        "name": "Emma Watson",
        "cover_image_url": "https://...",
        "popularity_rating": 95,
        "hotness_rating": 9
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Search Actresses

Search actresses by name.

**HTTP Method:** `GET`  
**Path:** `/actresses/search`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Search query (actress name) |
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 20 | Results per page (max: 50) |

#### Request Example

```
GET /api/v1/actresses/search?query=emma&page=1&limit=20
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "actresses": [
      {
        "id": "uuid",
        "name": "Emma Watson",
        "cover_image_url": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3
    }
  }
}
```

---

### Get Actress Profile

Get detailed actress profile with images.

**HTTP Method:** `GET`  
**Path:** `/actresses/:id`  
**Auth Required:** No

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Actress UUID |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for images |
| `limit` | integer | No | 20 | Images per page (max: 50) |
| `tags` | string | No | - | Comma-separated tag names to filter images |
| `minHotness` | integer | No | - | Minimum hotness rating (1-10) |
| `maxHotness` | integer | No | - | Maximum hotness rating (1-10) |
| `sortBy` | string | No | popularity | Sort images by: "popularity", "recent", "hotness" |

#### Request Example

```
GET /api/v1/actresses/uuid-123?page=1&limit=20&tags=cute,beach&minHotness=8&sortBy=recent
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "actress": {
      "id": "uuid",
      "name": "Emma Watson",
      "cover_image_url": "https://...",
      "popularity_rating": 95,
      "hotness_rating": 9,
      "images": [ /* array of image objects */ ],
      "imageCount": 150
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalImages": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "tags": ["cute", "beach"],
      "minHotness": 8,
      "maxHotness": null,
      "sortBy": "recent"
    }
  }
}
```

---

### Get Actress Data Only

Get actress profile without images.

**HTTP Method:** `GET`  
**Path:** `/actresses/actressdata/:id`  
**Auth Required:** No

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Actress UUID |

#### Request Example

```
GET /api/v1/actresses/actressdata/uuid-123
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Actress profile fetched successfully",
  "data": {
    "actress": {
      "id": "uuid",
      "name": "Emma Watson",
      "cover_image_url": "https://...",
      "popularity_rating": 95,
      "hotness_rating": 9,
      "tags": ["beautiful", "elegant"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## Trending

### Get Trending Images

Get top trending images from the last 7 days.

**HTTP Method:** `GET`  
**Path:** `/trending`  
**Auth Required:** No

#### Request Example

```
GET /api/v1/trending
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "images": [ /* array of top 50 trending images */ ]
  }
}
```

---

## Tags

### Get Popular Tags

Get popular tags sorted by usage count.

**HTTP Method:** `GET`  
**Path:** `/tags/popular`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 30 | Number of tags to return (max: 100) |
| `category` | string | No | - | Filter by category (e.g., "mood", "location") |

#### Request Example

```
GET /api/v1/tags/popular?limit=30&category=mood
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Popular tags fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "cute",
      "category": "mood",
      "usage_count": 156
    },
    {
      "id": "uuid",
      "name": "beach",
      "category": "location",
      "usage_count": 89
    }
  ]
}
```

---

### Search Tags

Search tags by name for autocomplete.

**HTTP Method:** `GET`  
**Path:** `/tags/search`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query (min 1 character) |
| `limit` | integer | No | 10 | Number of results (max: 20) |

#### Request Example

```
GET /api/v1/tags/search?q=bea&limit=5
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Tags found",
  "data": [
    {
      "id": "uuid",
      "name": "beach",
      "category": "location",
      "usage_count": 89
    },
    {
      "id": "uuid",
      "name": "beautiful",
      "category": "mood",
      "usage_count": 120
    }
  ]
}
```

---

### Get All Tags

Get all tags with optional filtering and sorting.

**HTTP Method:** `GET`  
**Path:** `/tags`  
**Auth Required:** No

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string | No | - | Filter by category |
| `search` | string | No | - | Search by tag name |

#### Request Example

```
GET /api/v1/tags?category=mood&search=cute
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Tags fetched successfully",
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "cute",
        "category": "mood",
        "usage_count": 156
      }
    ],
    "total": 1
  }
}
```

---

### Get Tag Categories

Get list of unique tag categories.

**HTTP Method:** `GET`  
**Path:** `/tags/categories`  
**Auth Required:** No

#### Request Example

```
GET /api/v1/tags/categories
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": {
    "categories": ["mood", "location", "outfit", "style", "event"],
    "total": 5
  }
}
```

---

## Admin

All admin endpoints require admin-level authentication (Bearer token from admin user).

### Admin Login

Authenticate admin user.

**HTTP Method:** `POST`  
**Path:** `/admin/login`  
**Auth Required:** No

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Admin email |
| `password` | string | Yes | Admin password |

#### Request Example

```json
{
  "email": "admin@filmy.com",
  "password": "secure_password"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Admin logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@filmy.com",
      "role": "admin"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

---

### Create Actress

Create a new actress profile.

**HTTP Method:** `POST`  
**Path:** `/admin/actress`  
**Auth Required:** Yes 🔐 (Admin only)

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Actress name |
| `coverImageUrl` | string | No | Cover image URL |
| `popularityRating` | integer | No | Popularity rating (0-100, default: 50) |
| `hotnessRating` | integer | No | Hotness rating (1-10, default: 5) |
| `tags` | string[] | No | Array of tag names |

#### Request Example

```json
{
  "name": "Emma Watson",
  "coverImageUrl": "https://example.com/emma.jpg",
  "popularityRating": 95,
  "hotnessRating": 9,
  "tags": ["beautiful", "elegant"]
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Actress created successfully",
  "data": {
    "id": "uuid",
    "name": "Emma Watson",
    "cover_image_url": "https://...",
    "popularity_rating": 95,
    "hotness_rating": 9,
    "tags": ["beautiful", "elegant"]
  }
}
```

---

### Update Actress

Update actress profile.

**HTTP Method:** `PUT`  
**Path:** `/admin/actress/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Actress UUID |

#### Request Body

All fields are optional. Only provided fields will be updated.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Actress name |
| `cover_image_url` | string | Cover image URL |
| `popularity_rating` | integer | Popularity rating (0-100) |
| `hotness_rating` | integer | Hotness rating (1-10) |
| `tags` | string[] | Array of tag names |

#### Request Example

```json
{
  "popularityRating": 98,
  "hotnessRating": 10
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Actress updated successfully",
  "data": {
    "id": "uuid",
    "name": "Emma Watson",
    "popularity_rating": 98,
    "hotness_rating": 10
  }
}
```

---

### Delete Actress

Delete an actress profile.

**HTTP Method:** `DELETE`  
**Path:** `/admin/actress/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Actress UUID |

#### Request Example

```
DELETE /api/v1/admin/actress/uuid-123
Authorization: Bearer <admin-token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Actress deleted successfully"
}
```

---

### Upload Single Image

Upload a single image for an actress.

**HTTP Method:** `POST`  
**Path:** `/admin/image`  
**Auth Required:** Yes 🔐 (Admin only)  
**Content-Type:** `multipart/form-data`

#### Form Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | JPG image file (max 10MB) |
| `actressId` | string | Yes | Actress UUID |
| `hotnessRating` | integer | Yes | Hotness rating (1-10) |
| `tags` | string | No | JSON array of tag names |

#### Request Example

```
POST /api/v1/admin/image
Content-Type: multipart/form-data
Authorization: Bearer <admin-token>

Form Data:
- file: <image.jpg>
- actressId: "uuid-123"
- hotnessRating: 8
- tags: ["cute", "beach"]
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Image uploaded and processed successfully",
  "data": {
    "id": "uuid",
    "actress_id": "uuid-123",
    "image_url": "https://storage.url/full/actress/uuid.webp",
    "thumbnail_url": "https://storage.url/thumb/actress/uuid.webp",
    "width": 1920,
    "height": 1080,
    "aspect_ratio": 1.7778,
    "file_size": 756450,
    "format": "webp",
    "is_webp": true,
    "blurhash": "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    "tags": ["cute", "beach"],
    "tag_ids": ["uuid-1", "uuid-2"],
    "hotness_rating": 8,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Bulk Upload Images

Upload multiple images for an actress in a single request.

**HTTP Method:** `POST`  
**Path:** `/admin/image/bulk`  
**Auth Required:** Yes 🔐 (Admin only)  
**Content-Type:** `multipart/form-data`

#### Form Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | file[] | Yes | Multiple JPG files (max 20, 10MB each) |
| `actressId` | string | Yes | Actress UUID (all images for same actress) |
| `hotnessRatings` | string | Yes | JSON array of ratings (one per file, e.g., [8,9,7]) |
| `tags` | string | No | JSON array of tag names (applied to ALL images) |

#### Request Example

```
POST /api/v1/admin/image/bulk
Content-Type: multipart/form-data
Authorization: Bearer <admin-token>

Form Data:
- files: <image1.jpg>
- files: <image2.jpg>
- files: <image3.jpg>
- actressId: "uuid-123"
- hotnessRatings: [8, 9, 7]
- tags: ["photoshoot", "beach"]
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Bulk upload completed: 3 successful, 0 failed",
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0,
    "duration": "12.5s"
  },
  "results": [
    {
      "index": 0,
      "filename": "image1.jpg",
      "status": "success",
      "data": { /* image object */ }
    },
    {
      "index": 1,
      "filename": "image2.jpg",
      "status": "success",
      "data": { /* image object */ }
    },
    {
      "index": 2,
      "filename": "image3.jpg",
      "status": "success",
      "data": { /* image object */ }
    }
  ]
}
```

---

### Update Image

Update image metadata (tags, hotness rating).

**HTTP Method:** `PUT`  
**Path:** `/admin/image/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Body

All fields are optional. Only provided fields will be updated.

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string[] | Array of tag names |
| `hotnessRating` | integer | Hotness rating (1-10) |
| `thumbnailUrl` | string | Thumbnail URL |

#### Request Example

```json
{
  "tags": ["cute", "beach", "summer"],
  "hotnessRating": 9
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "id": "uuid",
    "tags": ["cute", "beach", "summer"],
    "tag_ids": ["uuid-1", "uuid-2", "uuid-3"],
    "hotness_rating": 9,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Delete Image

Delete an image.

**HTTP Method:** `DELETE`  
**Path:** `/admin/image/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Image UUID |

#### Request Example

```
DELETE /api/v1/admin/image/uuid-123
Authorization: Bearer <admin-token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

### Create Tag

Create a new tag.

**HTTP Method:** `POST`  
**Path:** `/admin/tags`  
**Auth Required:** Yes 🔐 (Admin only)

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Tag name (will be lowercased) |
| `category` | string | No | Category (e.g., "mood", "location") |
| `description` | string | No | Tag description |

#### Request Example

```json
{
  "name": "vintage",
  "category": "style",
  "description": "Retro and classic style images"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "tag": {
      "id": "uuid",
      "name": "vintage",
      "category": "style",
      "description": "Retro and classic style images",
      "usage_count": 0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

### Update Tag

Update tag details.

**HTTP Method:** `PUT`  
**Path:** `/admin/tags/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Tag UUID |

#### Request Body

All fields are optional.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tag name |
| `category` | string | Tag category |
| `description` | string | Tag description |

---

### Delete Tag

Delete a tag.

**HTTP Method:** `DELETE`  
**Path:** `/admin/tags/:id`  
**Auth Required:** Yes 🔐 (Admin only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Tag UUID |

---

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions (admin required) |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Response Code:** 429 Too Many Requests

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## Notes

### Tag Filtering Performance

All endpoints that accept `tags` parameter use UUID-based filtering internally for 2-3x better performance on large datasets. Frontend should send tag **names** (strings), and backend automatically converts them to UUIDs.

### Image URLs

- Use `thumbnail_url` for feed/grid displays (optimized for fast loading)
- Use `image_url` for detail/full view only
- See `docs/IMAGE_URL_STRATEGY.md` for details

### Authentication Tokens

- Access tokens expire after 1 hour
- Refresh tokens expire after 30 days
- Include token in `Authorization` header: `Bearer <token>`

### Pagination

- Default: 20 items per page
- Maximum: 50 items per page
- Page numbers start at 1

---

**Version:** 1.0  
**Last Updated:** 2025-12-14  
**Maintained by:** Filmy Backend Team
