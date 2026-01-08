# API Documentation

## Base URL
```
<!-- http://localhost:3000/api/v1 -->
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### Send OTP
```http
POST /auth/phone/start
```

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "countryCode": "+91"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /auth/phone/verify
```

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "countryCode": "+91",
  "token": "123456"
}
```

**Response:**
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
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

---

### Onboarding

#### Save Preferences 🔒
```http
POST /onboarding/preferences
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "preferences": ["cute", "beautiful", "bold"]
}
```

#### Follow Actresses 🔒
```http
POST /onboarding/follow
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "actressIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

#### Get Suggested Actresses 🔒
```http
GET /onboarding/suggested-actresses?limit=20
Authorization: Bearer <token>
```

---


### Feed

**⚡ Performance Note:** For optimal feed loading, select only `thumbnail_url` (not `image_url`) in feed endpoints. Thumbnails are optimized for grid display. Use `image_url` only for detail/full view. See `docs/IMAGE_URL_STRATEGY.md` for details.

#### Default Feed 🔒
```http
GET /feed/default?page=1&limit=20&tags=cute,beautiful&minHotness=7
Authorization: Bearer <token>
```

**Recommended selection for feed:**
```sql
SELECT id, thumbnail_url, blurhash, aspect_ratio, hotness_rating, actress_id
```

#### Magic Shuffle 🔒
```http
GET /feed/magic-shuffle?limit=20
Authorization: Bearer <token>
```

#### Blend Feed 🔒
```http
GET /feed/blend?page=1&limit=20
Authorization: Bearer <token>
```

#### Custom Blend 🔒
```http
POST /feed/custom-blend
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "actressIds": ["uuid-1", "uuid-2"],
  "page": 1,
  "limit": 20,
  "tags": ["cute"],
  "minHotness": 7,
  "maxHotness": 10
}
```

---

### Images

#### List Images
```http
GET /images?page=1&limit=20&actressId=uuid&tags=cute&minHotness=7
```

#### Get Image
```http
GET /images/:id
```

#### Like Image 🔒
```http
POST /images/:id/like
Authorization: Bearer <token>
```

#### Unlike Image 🔒
```http
DELETE /images/:id/like
Authorization: Bearer <token>
```

#### Download Image 🔒
```http
POST /images/:id/download
Authorization: Bearer <token>
```

#### Set Wallpaper 🔒
```http
POST /images/:id/wallpaper
Authorization: Bearer <token>
```

---

### Actresses

#### List Actresses
```http
GET /actresses?page=1&limit=20&sortBy=popularity
```

**Sort Options:** `popularity`, `recent`, `name`

#### Search Actresses
```http
GET /actresses/search?query=emma&page=1&limit=20
```

#### Get Actress Profile
```http
GET /actresses/:id?page=1&limit=20&tags=cute,beach&minHotness=8&sortBy=recent
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Images per page (default: 20, max: 50)
- `tags`: Comma-separated tag names to filter images
- `minHotness`: Minimum hotness rating (1-10)
- `maxHotness`: Maximum hotness rating (1-10)
- `sortBy`: `popularity` (default), `recent`, or `hotness`

**Response:**
```json
{
  "success": true,
  "data": {
    "actress": {
      "id": "uuid",
      "name": "Actress Name",
      "cover_image_url": "https://...",
      "images": [ ... ],
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

### Trending

#### Get Trending Images
```http
GET /trending
```

Returns top 50 trending images from last 7 days.

---

### Admin 🔐

#### Create Actress
```http
POST /admin/actress
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Emma Watson",
  "coverImageUrl": "https://example.com/emma.jpg",
  "popularityRating": 95,
  "hotnessRating": 9,
  "tags": ["beautiful", "elegant"]
}
```

#### Update Actress
```http
PUT /admin/actress/:id
Authorization: Bearer <admin-token>
```

#### Delete Actress
```http
DELETE /admin/actress/:id
Authorization: Bearer <admin-token>
```

#### Upload Image
```http
POST /admin/image
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Description:** Upload a JPG image for an actress. The server processes the image (WebP conversion, thumbnails, BlurHash) and stores it in Supabase Storage.

**Request Body (Multipart Form):**
- `file`: JPG image file (Required, max 10MB)
- `actressId`: UUID of the actress (Required)
- `hotnessRating`: Number 0-100 (Required)
- `tags`: JSON array of tags (Optional, e.g. `["cute", "bold"]`)

**Processing Logic:**
- **Small Files (≤350KB):** Original JPG stored + Full-size WebP thumbnail generated.
- **Large Files (>350KB):** Converted to full-size WebP + Full-size WebP thumbnail generated.
- **Thumbnails:** Always full-size, WebP format, quality 75.

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded and processed successfully",
  "data": {
    "id": "uuid",
    "actress_id": "uuid",
    "image_url": "https://storage.url/full/actress/uuid.webp",
    "width": 1920,
    "height": 1080,
    "aspect_ratio": 1.7778,
    "file_size": 756450,
    "format": "webp",
    "is_webp": true,
    "blurhash": "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    "storage_paths": {
      "full": "full/actress/uuid.webp",
      "thumb": "thumb/actress/uuid.webp"
    },
    "tags": ["cute", "bold"],
    "hotness_rating": 85,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### Bulk Upload Images
```http
POST /admin/image/bulk
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Description:** Upload multiple JPG images for an actress in a single request with concurrency control.

**Request Body (Multipart Form):**
- `files`: Multiple JPG image files (Required, max 20 files, 10MB each)
- `actressId`: UUID of the actress (Required, all images for same actress)
- `hotnessRatings`: JSON array of numbers (Required, one rating per file, e.g. `[85,90,88]`)
- `tags`: JSON array of tags (Optional, applied to ALL images, e.g. `["photoshoot","beach"]`)

**Processing:**
- Processes up to 5 images in parallel (configurable)
- Same processing as single upload (WebP conversion, thumbnails, blurhash)
- Continues processing even if some images fail (partial success)
- Max total size: 200MB (configurable)

**Response:**
```json
{
  "success": true,
  "message": "Bulk upload completed: 18 successful, 2 failed",
  "summary": {
    "total": 20,
    "successful": 18,
    "failed": 2,
    "duration": "45.2s"
  },
  "results": [
    {
      "index": 0,
      "filename": "image1.jpg",
      "status": "success",
      "data": { /* Same as single upload response */ }
    },
    {
      "index": 1,
      "filename": "image2.jpg",
      "status": "failed",
      "error": "Invalid file format"
    }
  ]
}
```

**See:** `docs/BULK_UPLOAD_DOCUMENTATION.md` for complete details, testing guide, and troubleshooting.

---

#### Update Image 🔐
```http
PUT /admin/image/:id
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Description:** Update an image's metadata including tags and hotness rating.

**URL Parameters:**
- `id`: UUID of the image to update (Required)

**Request Body:**
```json
{
  "tags": ["cute", "beach", "summer"],
  "hotnessRating": 8,
  "thumbnailUrl": "https://storage.url/thumb/new-thumb.webp"
}
```

**Request Fields:**
- `tags`: Array of tag names (Optional) - Will be converted to UUIDs automatically
- `hotnessRating`: Number 1-10 (Optional)
- `thumbnailUrl`: String URL (Optional)

**Response:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "id": "uuid",
    "actress_id": "uuid",
    "image_url": "https://storage.url/full/actress/uuid.webp",
    "thumbnail_url": "https://storage.url/thumb/actress/uuid.webp",
    "tags": ["cute", "beach", "summer"],
    "tag_ids": ["uuid-1", "uuid-2", "uuid-3"],
    "hotness_rating": 8,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- `400`: No valid fields provided / Invalid hotness rating
- `404`: Image not found
- `500`: Update failed

---

#### Delete Image 🔐
```http
DELETE /admin/image/:id
Authorization: Bearer <admin-token>
```

**Description:** Delete an image from the database.

**URL Parameters:**
- `id`: UUID of the image to delete (Required)

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Errors:**
- `404`: Image not found
- `500`: Delete failed

---

### Tags 🏷️

Tags help organize and categorize images. The system uses UUID-based tags with automatic usage tracking.

#### Get Popular Tags
```http
GET /tags/popular?limit=20&category=mood
```

**Query Parameters:**
- `limit`: Number of tags to return (default: 20, max: 100)
- `category`: Filter by category (optional, e.g., "mood", "location", "outfit")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "cute",
      "category": "mood",
      "description": "Adorable and sweet images",
      "usage_count": 156,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "name": "beach",
      "category": "location",
      "usage_count": 89,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### Search Tags (Autocomplete)
```http
GET /tags/search?q=bea&limit=10
```

**Query Parameters:**
- `q`: Search query (required, min 1 character)
- `limit`: Number of results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "beach",
      "category": "location",
      "usage_count": 89
    },
    {
      "id": "uuid-2",
      "name": "beautiful",
      "category": "mood",
      "usage_count": 120
    }
  ]
}
```

**Use Case:** Tag autocomplete in upload form
```typescript
// Frontend example
const handleTagInput = async (input: string) => {
  const response = await fetch(`/api/v1/tags/search?q=${input}&limit=5`);
  const { data } = await response.json();
  setSuggestions(data);  // Show in dropdown
};
```

---

#### Get All Tags by Category
```http
GET /tags?category=mood&sort=usage&order=desc
```

**Query Parameters:**
- `category`: Filter by category (optional)
- `sort`: Sort by "name", "usage", or "created" (default: "name")
- `order`: "asc" or "desc" (default: "asc")
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "cute", "usage_count": 156 },
    { "id": "uuid", "name": "bold", "usage_count": 98 }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2
  }
}
```

---

#### Create Tag 🔐
```http
POST /admin/tags
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "vintage",
  "category": "style",
  "description": "Retro and classic style images"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "id": "uuid",
    "name": "vintage",
    "category": "style",
    "description": "Retro and classic style images",
    "usage_count": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Tag Workflow for Bulk Upload

**Step-by-step guide for implementing tag selection in bulk upload:**

#### 1. Fetch Available Tags (On Page Load)
```javascript
// Get popular tags to show as suggestions
const response = await fetch('/api/v1/tags/popular?limit=30');
const { data: popularTags } = await response.json();

// Display as chips/pills for quick selection
popularTags.map(tag => (
  <TagChip 
    label={tag.name}
    count={tag.usage_count}
    onClick={() => selectTag(tag.name)}
  />
))
```

#### 2. Tag Search/Autocomplete (On User Input)
```javascript
// User types in tag input
const searchTags = async (query) => {
  if (query.length < 2) return;
  
  const response = await fetch(`/api/v1/tags/search?q=${query}&limit=5`);
  const { data: suggestions } = await response.json();
  
  // Show dropdown with suggestions
  return suggestions.map(tag => ({
    label: tag.name,
    value: tag.name,
    category: tag.category
  }));
};
```

#### 3. Send Tags with Bulk Upload
```javascript
// Selected tags (array of strings)
const selectedTags = ["cute", "beach", "summer"];

// Create FormData
const formData = new FormData();

// Add files (multiple)
files.forEach(file => {
  formData.append('files', file);
});

// Add actress ID
formData.append('actressId', actressId);

// Add hotness ratings (one per file)
formData.append('hotnessRatings', JSON.stringify([85, 90, 88]));

// Add tags (applied to ALL images)
formData.append('tags', JSON.stringify(selectedTags));

// Upload
const response = await fetch('/api/v1/admin/image/bulk', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

#### 4. Backend Processing (Automatic)
```
1. Backend receives tags: ["cute", "beach", "summer"]
2. Converts to UUIDs: [uuid-cute, uuid-beach, uuid-summer]
3. Creates new tags if they don't exist
4. Applies to all uploaded images
5. Updates usage_count automatically (via trigger)
```

#### 5. Complete Example (React)
```jsx
function BulkUploadForm() {
  const [files, setFiles] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  
  // Load popular tags on mount
  useEffect(() => {
    fetch('/api/v1/tags/popular?limit=20')
      .then(res => res.json())
      .then(data => setTagSuggestions(data.data));
  }, []);
  
  // Search tags on input
  const handleTagSearch = async (query) => {
    const res = await fetch(`/api/v1/tags/search?q=${query}&limit=5`);
    const { data } = await res.json();
    return data.map(tag => tag.name);
  };
  
  // Handle upload
  const handleUpload = async () => {
    const formData = new FormData();
    
    files.forEach(file => formData.append('files', file));
    formData.append('actressId', actressId);
    formData.append('hotnessRatings', JSON.stringify(ratings));
    formData.append('tags', JSON.stringify(selectedTags));
    
    const response = await fetch('/api/v1/admin/image/bulk', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    const result = await response.json();
    console.log(`Uploaded: ${result.summary.successful}/${result.summary.total}`);
  };
  
  return (
    <div>
      <FileUpload onChange={setFiles} multiple />
      
      <TagInput
        selected={selectedTags}
        onChange={setSelectedTags}
        onSearch={handleTagSearch}
        suggestions={tagSuggestions.map(t => t.name)}
      />
      
      <Button onClick={handleUpload}>Upload {files.length} Images</Button>
    </div>
  );
}
```

---

### Tag Best Practices

**For Bulk Upload:**
- ✅ Fetch popular tags on page load (quick selection)
- ✅ Implement autocomplete for custom tags
- ✅ Allow both selection from suggestions and custom input
- ✅ Show tag usage count for popularity indication
- ✅ Apply same tags to all images in bulk upload
- ✅ Backend auto-creates new tags if they don't exist

**Tag Categories:**
| Category | Examples |
|----------|----------|
| `mood` | cute, sexy, bold, elegant, sweet |
| `location` | beach, studio, outdoor, indoor |
| `outfit` | dress, bikini, casual, formal |
| `style` | vintage, modern, minimalist |
| `event` | party, wedding, photoshoot |

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response:** `429 Too Many Requests`

---

## Legend

- 🔒 - Authentication required
- 🔐 - Admin access required
