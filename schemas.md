## Table `actresses`

Actress profiles with popularity and hotness ratings

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `varchar` |  Unique |
| `cover_image_url` | `text` |  Nullable |
| `popularity_rating` | `int4` |  |
| `hotness_rating` | `int4` |  |
| `tags` | `_text` |  Nullable |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `downloads`

Track image downloads for popularity calculation

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `image_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `explore_featured_actresses`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `actress_id` | `uuid` |  Unique |
| `position` | `int2` |  Unique |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `explore_highlights`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `image_id` | `uuid` |  Unique |
| `position` | `int2` |  Unique |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `favorite_folders`

User-created folders for organizing saved images (Pinterest-style)

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `name` | `varchar` |  |
| `cover_image_id` | `uuid` |  Nullable |
| `is_default` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `favorite_images`

Many-to-many relationship between folders and saved images

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `folder_id` | `uuid` |  |
| `image_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `favorites_actresses`

User favorite actresses for personalized feeds

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `actress_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `image_views`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `user_id` | `uuid` | Primary |
| `image_id` | `uuid` | Primary |
| `viewed_at` | `timestamptz` |  |

## Table `images`

Images associated with actresses, includes computed popularity score

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `actress_id` | `uuid` |  |
| `image_url` | `text` |  |
| `tags` | `_text` |  Nullable |
| `hotness_rating` | `int4` |  |
| `likes_count` | `int4` |  |
| `downloads_count` | `int4` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |
| `width` | `int4` |  Nullable |
| `height` | `int4` |  Nullable |
| `aspect_ratio` | `numeric` |  Nullable |
| `file_size` | `int8` |  Nullable |
| `format` | `text` |  Nullable |
| `is_webp` | `bool` |  Nullable |
| `blurhash` | `text` |  Nullable |
| `storage_paths` | `jsonb` |  Nullable |
| `thumbnail_url` | `text` |  Nullable |
| `tag_ids` | `_uuid` |  Nullable |
| `popularity_score` | `numeric` |  Nullable |

## Table `likes`

User likes for images (unique constraint prevents duplicate likes)

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `image_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `recent_searches`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `query` | `varchar` |  |
| `searched_at` | `timestamptz` |  |

## Table `tags`

Centralized tags for categorizing images and actresses

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `varchar` |  Unique |
| `category` | `varchar` |  Nullable |
| `description` | `text` |  Nullable |
| `usage_count` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `users`

Application users with phone authentication and preferences

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `supabase_id` | `uuid` |  Unique |
| `phone_number` | `varchar` |  |
| `country_code` | `varchar` |  |
| `preferences` | `_preference_type` |  Nullable |
| `favorite_actress_ids` | `_uuid` |  Nullable |
| `role` | `user_role` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |
| `preferred_tag_ids` | `_uuid` |  Nullable |

