# Favorites Folders API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**All endpoints require authentication** (`Authorization: Bearer <token>`)

---

## Overview

Organize saved images into folders (Pinterest-style). Features:
- **Default folder** - "Favorites" folder auto-created on first access
- **Cover image** - Automatically set to last saved image
- **Unique names** - Folder names must be unique per user
- **Cascade delete** - Deleting folder removes all saved images

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/favorites/folders` | Get all folders |
| POST | `/favorites/folders` | Create folder |
| DELETE | `/favorites/folders/:folderId` | Delete folder |
| GET | `/favorites/folders/:folderId/images` | Get folder images |
| POST | `/favorites/folders/:folderId/images/:imageId` | Add image to folder |
| DELETE | `/favorites/folders/:folderId/images/:imageId` | Remove image |

---

## Get Folders

**GET** `/favorites/folders`

Returns all user's folders with cover image and image count.

### Request

```
GET /api/v1/favorites/folders
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "message": "Folders fetched successfully",
  "data": {
    "folders": [
      {
        "id": "uuid-1",
        "name": "Favorites",
        "isDefault": true,
        "imageCount": 15,
        "coverImage": {
          "id": "img-uuid",
          "imageUrl": "https://...",
          "hotnessRating": 8
        },
        "createdAt": "2026-01-03T14:00:00Z",
        "updatedAt": "2026-01-03T14:00:00Z"
      }
    ]
  }
}
```

> **Note:** Default "Favorites" folder is created automatically on first access.

---

## Create Folder

**POST** `/favorites/folders`

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Folder name (1-100 chars, unique per user) |

```json
{
  "name": "Wallpapers"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "folder": {
      "id": "uuid-2",
      "name": "Wallpapers",
      "isDefault": false,
      "imageCount": 0,
      "coverImage": null,
      "createdAt": "2026-01-03T15:00:00Z",
      "updatedAt": "2026-01-03T15:00:00Z"
    }
  }
}
```

### Errors

| Code | Message |
|------|---------|
| 400 | Folder name already exists |
| 400 | Folder name is required |

---

## Delete Folder

**DELETE** `/favorites/folders/:folderId`

Deletes folder and all saved images. **Cannot delete default folder.**

### Request

```
DELETE /api/v1/favorites/folders/uuid-123
Authorization: Bearer <token>
```

### Response (200)

```json
{
  "success": true,
  "message": "Folder deleted successfully"
}
```

### Errors

| Code | Message |
|------|---------|
| 400 | Cannot delete default folder |
| 404 | Folder not found |

---

## Get Folder Images

**GET** `/favorites/folders/:folderId/images`

Get paginated images from a folder.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Images per page (max: 50) |
| `sortBy` | string | recent | Sort: "recent" or "oldest" |

### Request

```
GET /api/v1/favorites/folders/uuid-123/images?page=1&limit=20&sortBy=recent
Authorization: Bearer <token>
```

### Response (200)

```json
{
  "success": true,
  "message": "Folder images fetched successfully",
  "data": {
    "folder": {
      "id": "uuid-1",
      "name": "Favorites"
    },
    "images": [
      {
        "id": "img-uuid",
        "imageUrl": "https://...",
        "tags": ["cute", "beach"],
        "hotnessRating": 8,
        "likesCount": 100,
        "isUserLiked": true,
        "actress": {
          "id": "actress-uuid",
          "name": "Emma Watson",
          "coverImageUrl": "https://..."
        },
        "savedAt": "2026-01-03T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## Add Image to Folder

**POST** `/favorites/folders/:folderId/images/:imageId`

Save image to folder. **Idempotent** - returns success if already saved.

### Request

```
POST /api/v1/favorites/folders/uuid-folder/images/uuid-image
Authorization: Bearer <token>
```

### Response (201)

```json
{
  "success": true,
  "message": "Image added to folder successfully"
}
```

### Response (200 - Already Saved)

```json
{
  "success": true,
  "message": "Image already in folder"
}
```

### Errors

| Code | Message |
|------|---------|
| 404 | Folder not found |
| 404 | Image not found |

> **Note:** Cover image automatically updates to the last saved image.

---

## Remove Image from Folder

**DELETE** `/favorites/folders/:folderId/images/:imageId`

### Request

```
DELETE /api/v1/favorites/folders/uuid-folder/images/uuid-image
Authorization: Bearer <token>
```

### Response (200)

```json
{
  "success": true,
  "message": "Image removed from folder successfully"
}
```

> **Note:** If removed image was the cover, cover updates to the next most recent image.

---

## Database Schema

### `favorite_folders` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| name | VARCHAR(100) | Folder name (unique per user) |
| cover_image_id | UUID | FK to images (auto-updated) |
| is_default | BOOLEAN | Default folder flag |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### `favorite_images` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| folder_id | UUID | FK to favorite_folders |
| image_id | UUID | FK to images |
| created_at | TIMESTAMPTZ | When image was saved |

### Triggers

- **Cover auto-update** - Sets cover to last saved image on INSERT
- **Cover reset** - Updates cover to next recent image when cover is deleted
