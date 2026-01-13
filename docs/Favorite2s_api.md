# Likes & Favorites API Reference

> **All endpoints require authentication** - Include `Authorization: Bearer <token>` header

---

## Favorites Preview

Get preview data for favorites page.

### Endpoint
```
GET /api/v1/favorites/preview
```

### Response
```json
{
  "success": true,
  "data": {
    "liked": {
      "images": [
        { "id": "...", "thumbnailUrl": "...", "aspectRatio": 0.75, "blurHash": "..." }
      ],
      "totalCount": 150
    },
    "saved": {
      "images": [
        { "id": "...", "thumbnailUrl": "...", "aspectRatio": 0.75, "blurHash": "..." }
      ],
      "totalCount": 85
    },
    "following": [
      { "id": "...", "name": "Actress Name", "coverImageUrl": "..." }
    ]
  }
}
```

**Note:** `following` contains top 4 actress profiles the user follows (sorted by most liked images from that actress).

---

## Liked Images

### Get All Liked Images (Cursor Pagination)

```
GET /api/v1/likes?limit=20&cursor=<timestamp>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Results per page (max 50) |
| `cursor` | string | - | `nextCursor` from previous response |

### Response
```json
{
  "images": [
    {
      "id": "...",
      "thumbnailUrl": "...",
      "aspectRatio": 0.75,
      "blurHash": "...",
      "isUserLiked": true,
      "actress": { "id": "...", "name": "..." },
      "likedAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": { "limit": 20, "hasNextPage": true, "nextCursor": "..." }
}
```

---

### Get Liked Count
```
GET /api/v1/likes/count
```

---

## Saved Images (Folders)

### Get All Folders
```
GET /api/v1/favorites/folders
```

### Response
```json
{
  "folders": [
    {
      "id": "...",
      "name": "Favorites",
      "isDefault": true,
      "imageCount": 12,
      "coverImage": { "id": "...", "thumbnailUrl": "..." }
    }
  ]
}
```

---

### Get Folder Images (Cursor Pagination)
```
GET /api/v1/favorites/folders/:folderId/images?limit=20&cursor=<timestamp>
```

### Response
```json
{
  "folder": { "id": "...", "name": "Favorites" },
  "images": [
    {
      "id": "...",
      "thumbnailUrl": "...",
      "aspectRatio": 0.75,
      "blurHash": "...",
      "isUserLiked": true,
      "actress": { "id": "...", "name": "..." },
      "savedAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": { "limit": 20, "hasNextPage": true, "nextCursor": "..." }
}
```

---

## Summary

| Endpoint | Key Fields |
|----------|------------|
| `/favorites/preview` | `blurHash`, `following` (top 4 profiles) |
| `/likes` | `blurHash`, cursor pagination |
| `/favorites/folders` | `thumbnailUrl` in coverImage |
| `/favorites/folders/:id/images` | `blurHash`, cursor pagination |
