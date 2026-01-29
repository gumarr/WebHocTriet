# Hướng dẫn sử dụng Migrate Script

## Tổng quan

File `scripts/migrate.ts` được thiết kế để chuyển toàn bộ dữ liệu từ folder `data/` sang Supabase database một cách an toàn và có kiểm soát.

## Chuẩn bị

### 1. Cấu hình môi trường

Tạo file `.env.local` trong thư mục gốc với các biến sau:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_PASSWORD=odGdeGQUVw5efjdy
```

**Lưu ý quan trọng:**
- `SUPABASE_SERVICE_ROLE_KEY` là **PRIVATE KEY** có quyền admin, **không được commit lên git**
- Lấy key này từ: Supabase Dashboard → Settings → API → Service Role Key

### 2. Kiểm tra database schema

Đảm bảo các bảng sau đã được tạo trong Supabase:

- `chapters` (id, title, description, order, image_url)
- `lessons` (id, chapter_id, title, order, summary, content)
- `sections` (id, lesson_id, title, content, type)
- `flashcards` (id, question, answer, category, difficulty, lesson_id)
- `tests` (id, lesson_id, title, duration)
- `test_questions` (id, test_id, question, options, correct_answer, explanation)

## Cách sử dụng

### Chạy migration

```bash
cd philosophy-study
npx tsx scripts/migrate.ts
```

### Theo dõi tiến độ

Script sẽ hiển thị tiến độ chi tiết:

```
✅ Kết nối Supabase thành công
🚀 Bắt đầu quá trình đẩy dữ liệu...
📚 Đang xử lý chương: Chương 1 - Vấn đề cơ bản của triết học
  📖 Đang xử lý bài: 1.1 - Triết học là gì?
    📝 Đang chèn 3 sections
    🎴 Đang chèn 5 flashcards
    🧪 Đang chèn test với 10 câu hỏi
  ✅ Hoàn thành bài: 1.1 - Triết học là gì?
✅ Hoàn thành chương: Chương 1 - Vấn đề cơ bản của triết học
🏁 Hoàn thành migration!
```

## Tính năng nổi bật

### 1. Kiểm tra kết nối
- Tự động kiểm tra kết nối Supabase trước khi migrate
- Thông báo rõ ràng nếu có lỗi cấu hình

### 2. Xử lý lỗi chi tiết
- Ghi log lỗi cụ thể cho từng entity (chapter, lesson, section, v.v.)
- Tiếp tục migrate các phần khác nếu có lỗi ở phần nào đó

### 3. Tạo ID tự động
- Tạo ID duy nhất cho các entity không có ID:
  - Sections: `{lesson_id}-{title-slug}`
  - Flashcards: `{lesson_id}-flashcard-{index}`
  - Tests: `{lesson_id}-test`
  - Questions: `{test_id}-question-{index}`

### 4. Upsert thông minh
- Sử dụng `upsert` thay vì `insert` để tránh lỗi duplicate key
- Cập nhật dữ liệu nếu đã tồn tại, tạo mới nếu chưa có

## Xử lý sự cố

### Lỗi kết nối
```
❌ Lỗi kết nối Supabase: invalid_grant
Vui lòng kiểm tra:
1. NEXT_PUBLIC_SUPABASE_URL trong .env
2. SUPABASE_SERVICE_ROLE_KEY trong .env
3. Đảm bảo đã tạo các bảng trong Supabase
```

**Cách khắc phục:**
- Kiểm tra URL Supabase có đúng không
- Kiểm tra Service Role Key có hợp lệ không
- Kiểm tra các bảng đã được tạo chưa

### Lỗi insert dữ liệu
```
❌ Lỗi chèn sections: null value in column "title" violates not-null constraint
```

**Cách khắc phục:**
- Kiểm tra dữ liệu trong folder `data/` có đầy đủ field không
- Kiểm tra schema database có khớp với dữ liệu không

### Lỗi quyền
```
❌ Lỗi chèn flashcards: new row violates row-level security policy
```

**Cách khắc phục:**
- Đảm bảo đang dùng `SUPABASE_SERVICE_ROLE_KEY` (không phải ANON_KEY)
- Kiểm tra RLS policies trong Supabase

## Tối ưu hóa

### 1. Batch insert
Hiện tại script insert từng record một. Có thể tối ưu bằng cách:

```typescript
// Thay vì insert từng cái
for (const section of sections) {
  await supabase.from('sections').insert(section);
}

// Nên insert theo batch
await supabase.from('sections').insert(sections);
```

### 2. Transaction
Có thể bọc toàn bộ migration trong transaction để đảm bảo atomicity:

```typescript
await supabase.rpc('begin_transaction');
// ... migrate logic
await supabase.rpc('commit_transaction');
```

## Lưu ý quan trọng

1. **Backup database** trước khi chạy migration
2. **Không commit** file `.env.local` lên git
3. **Service Role Key** là private key, không chia sẻ công khai
4. Script chỉ chạy **một chiều** từ local → Supabase, không có rollback
5. Sử dụng `upsert` để tránh lỗi duplicate khi chạy nhiều lần

## Kiểm tra kết quả

Sau khi migrate xong, có thể kiểm tra bằng cách:

1. Vào Supabase Dashboard → Table Editor
2. Kiểm tra số lượng record trong các bảng
3. So sánh với số lượng trong folder `data/`

```sql
-- Kiểm tra số lượng
SELECT COUNT(*) FROM chapters;
SELECT COUNT(*) FROM lessons;
SELECT COUNT(*) FROM sections;
SELECT COUNT(*) FROM flashcards;
SELECT COUNT(*) FROM tests;
SELECT COUNT(*) FROM test_questions;