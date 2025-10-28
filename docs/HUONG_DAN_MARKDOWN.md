# 📝 Hướng Dẫn Sử Dụng Markdown Preview

## Giới Thiệu

Notix giờ đây hỗ trợ **Markdown Preview** - bạn có thể viết ghi chú bằng cú pháp markdown và xem kết quả được render đẹp mắt!

## 🚀 Cách Sử Dụng Nhanh

### Bước 1️⃣: Viết Markdown

Gõ ghi chú của bạn với cú pháp markdown:

```markdown
# Tiêu đề chính

## Tiêu đề phụ

Đây là văn bản **in đậm** và _in nghiêng_.

-   Mục 1
-   Mục 2
-   Mục 3
```

### Bước 2️⃣: Xem Preview

Click nút **"Preview"** ở góc dưới-phải → Xem markdown được render thành HTML đẹp!

### Bước 3️⃣: Chỉnh Sửa

Click **"Preview"** lần nữa → Quay lại chế độ chỉnh sửa

## 📖 Cú Pháp Markdown Được Hỗ Trợ

### 📌 Tiêu Đề

```markdown
# Tiêu đề cấp 1

## Tiêu đề cấp 2

### Tiêu đề cấp 3

#### Tiêu đề cấp 4

##### Tiêu đề cấp 5

###### Tiêu đề cấp 6
```

### ✨ Định Dạng Văn Bản

```markdown
**In đậm** hoặc **In đậm**
_In nghiêng_ hoặc _In nghiêng_
~~Gạch ngang~~
```

### 🔗 Liên Kết

```markdown
[Văn bản hiển thị](https://example.com)
```

### 🖼️ Hình Ảnh

```markdown
![Mô tả hình](đường-dẫn-hình)
![Ảnh paste](data:image/png;base64,...)
```

### 📋 Danh Sách

**Danh sách không thứ tự:**

```markdown
-   Mục 1
-   Mục 2
-   Mục 3
```

**Danh sách có thứ tự:**

```markdown
1. Mục đầu tiên
2. Mục thứ hai
3. Mục thứ ba
```

### 💻 Code

**Inline code:**

```markdown
Sử dụng `const x = 10` cho biến const
```

**Code block:**

```markdown

```

function hello() {
console.log("Xin chào!")
}

```

```

### 💬 Trích Dẫn

```markdown
> Đây là một trích dẫn
> Có thể nhiều dòng
```

### ➖ Dòng Phân Cách

```markdown
---

hoặc

---
```

## 🎨 Ví Dụ Thực Tế

### Ví Dụ 1: Danh Sách Mua Sắm

```markdown
# Danh Sách Mua Sắm 🛒

## Thực Phẩm

-   Sữa
-   Trứng
-   Bánh mì
-   Rau xanh

## Đồ Gia Dụng

1. Giấy vệ sinh
2. Nước rửa chén
3. Xà phòng

**Tổng ngân sách**: 500.000đ
```

### Ví Dụ 2: Ghi Chú Công Việc

```markdown
# Công Việc Tuần Này

## Ưu Tiên Cao 🔴

-   **Hoàn thành báo cáo** - Hạn: Thứ 5
-   **Họp với khách hàng** - 10h sáng thứ 6

## Ưu Tiên Trung Bình 🟡

-   Cập nhật tài liệu
-   Review code của team

## Ưu Tiên Thấp 🟢

-   Tổ chức workspace
-   Học skill mới

> Nhớ: Coffee meeting với sếp lúc 3h chiều!
```

### Ví Dụ 3: Ghi Chú Học Tập

```markdown
# Ghi Chú JavaScript

## Arrow Functions

**Cú pháp:**
```

const sum = (a, b) => a + b

```

**Đặc điểm:**
- Ngắn gọn hơn function thường
- Không có `this` riêng
- Không thể dùng làm constructor

**Ví dụ:**
```

const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n \* 2)
console.log(doubled) // [2, 4, 6, 8, 10]

```

```

### Ví Dụ 4: Kế Hoạch Du Lịch

```markdown
# Kế Hoạch Du Lịch Đà Nẵng 🏖️

## Thông Tin Chuyến Đi

-   **Ngày đi**: 15/11/2025
-   **Ngày về**: 18/11/2025
-   **Phương tiện**: Máy bay

## Lịch Trình

### Ngày 1 (15/11)

1. Bay đến Đà Nẵng - 9h sáng
2. Check-in khách sạn
3. Tham quan Bà Nà Hills
4. Tối: Ăn hải sản

### Ngày 2 (16/11)

1. Sáng: Bãi biển Mỹ Khê
2. Trưa: Phố cổ Hội An
3. Chiều: Chụp ảnh ở cầu vàng
4. Tối: Dạo chợ đêm

### Ngày 3 (17/11)

-   Nghỉ ngơi tại resort
-   Spa & massage
-   BBQ party tối

### Ngày 4 (18/11)

-   Mua quà về
-   Bay về - 2h chiều

## Đồ Cần Mang

-   [ ] Quần áo
-   [ ] Kem chống nắng
-   [ ] Camera
-   [ ] Thuốc cần thiết

**Budget dự kiến**: 10.000.000đ

> Nhớ đặt phòng trước 1 tuần!
```

## 🎯 Mẹo Sử Dụng

### 💡 Viết Nhanh

1. Dùng `#` cho tiêu đề
2. `**text**` cho in đậm nhanh
3. `- ` cho danh sách nhanh
4. ```cho code block

   ```

### 💡 Quy Trình Hiệu Quả

1. Viết nội dung ở chế độ edit
2. Quick preview để kiểm tra
3. Tiếp tục chỉnh sửa
4. Preview cuối cùng trước khi save

### 💡 Tổ Chức Ghi Chú

-   Dùng tiêu đề để phân cấp
-   Trích dẫn cho thông tin quan trọng
-   Danh sách cho các hành động
-   Code block cho đoạn code

### 💡 Làm Việc Với Hình Ảnh

-   Paste ảnh bằng Ctrl+V
-   Xem ảnh trong preview mode
-   Toggle về để thấy markdown syntax
-   Export để chia sẻ ghi chú có ảnh

## 🎨 Giao Diện

### Nút Preview

-   **Vị trí**: Góc dưới-phải của ghi chú
-   **Màu xanh dương**: Đang ở chế độ edit
-   **Màu xanh lá**: Đang ở chế độ preview

### Preview Đẹp Mắt

-   Tiêu đề có màu sắc khác nhau
-   Code blocks với nền tối
-   Links có màu xanh
-   Hình ảnh responsive
-   Blockquotes nổi bật

## ❓ Câu Hỏi Thường Gặp

### Preview không cập nhật?

-   Đảm bảo đang ở chế độ preview
-   Thử toggle off/on
-   Kiểm tra syntax markdown

### Cú pháp không render?

-   Kiểm tra lỗi chính tả
-   Đảm bảo có khoảng trắng đúng
-   Thử pattern đơn giản hơn

### Không thấy nút Preview?

-   Scroll xuống góc dưới-phải
-   Đảm bảo đang mở ghi chú
-   Thử refresh extension

### Ảnh không hiện?

-   Kiểm tra URL ảnh
-   Với base64, đảm bảo data đầy đủ
-   Thử paste ảnh lại

## 🔥 Tính Năng Nổi Bật

✨ **Auto-update**: Preview tự động cập nhật khi gõ
✨ **Paste ảnh**: Dán ảnh trực tiếp bằng Ctrl+V
✨ **Auto-save**: Tự động lưu khi chỉnh sửa
✨ **Sync**: Đồng bộ giữa các tab
✨ **Export**: Xuất ra text hoặc ảnh

## 🎓 Học Markdown

### Tài Nguyên

-   [Markdown Guide](https://www.markdownguide.org/)
-   [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
-   Practice trong Notix!

### Thực Hành

1. Mở trang test: `docs/test_markdown_preview.html`
2. Thử các cú pháp khác nhau
3. Xem preview real-time
4. Học qua ví dụ

## 🚀 Bắt Đầu Ngay

1. **Mở Notix**
2. **Tạo ghi chú mới**
3. **Viết markdown**
4. **Click Preview**
5. **Tận hưởng!** 🎉

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Đọc lại hướng dẫn
2. Xem các ví dụ
3. Kiểm tra cú pháp markdown
4. Thử với pattern đơn giản

## 💖 Tận Hưởng Notix!

Chúc bạn viết ghi chú vui vẻ với Markdown Preview!

_Happy note-taking! 📝✨_
