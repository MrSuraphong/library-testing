# คู่มือทดสอบ API ด้วย Postman

ตั้งค่า Base URL เป็น: `http://localhost:3000`

---

## 1. ระบบสมาชิก (Authentication)

### 👉 สมัครสมาชิก (Register)
- **Method:** `POST`
- **URL:** `http://localhost:3000/register`
- **Body:** (เลือก Raw -> JSON)
```json
{
    "username": "testuser",
    "password": "password123",
    "role": "member"
}
```

### 👉 เข้าสู่ระบบ (Login)
- **Method:** `POST`
- **URL:** `http://localhost:3000/login`
- **Body:** (เลือก Raw -> JSON)
```json
{
    "username": "testuser",
    "password": "password123"
}
```

### 👉 ดูข้อมูลสมาชิก (Admin Only)
- **Method:** `GET`
- **URL:** `http://localhost:3000/users`
- **Body:** ไม่ต้องใส่

---

## 2. ระบบจัดการหนังสือ (Books)

### 👉 เพิ่มหนังสือ (Add Book)
- **Method:** `POST`
- **URL:** `http://localhost:3000/books`
- **Body:** (เลือก Raw -> JSON)
```json
{
    "title": "Introduction to Docker",
    "author": "Docker Captain",
    "quantity": 5,
    "coverImage": "https://example.com/docker.png"
}
```

### 👉 ดูรายชื่อหนังสือทั้งหมด (Get All Books)
- **Method:** `GET`
- **URL:** `http://localhost:3000/books`
- **Body:** ไม่ต้องใส่

### 👉 ลบหนังสือ (Delete Book)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/YOUR_BOOK_ID_HERE`
- **หมายเหตุ:** เอา `_id` ของหนังสือจากรายการหนังสือมาใส่แทน `YOUR_BOOK_ID_HERE`

---

## 3. ระบบยืม-คืน (Transactions)

### 👉 ยืมหนังสือ (Borrow)
- **Method:** `POST`
- **URL:** `http://localhost:3000/borrow`
- **Body:** (เลือก Raw -> JSON)
```json
{
    "user_id": "YOUR_USER_ID_HERE",
    "book_id": "YOUR_BOOK_ID_HERE"
}
```

### 👉 คืนหนังสือ (Return)
- **Method:** `POST`
- **URL:** `http://localhost:3000/return`
- **Body:** (เลือก Raw -> JSON)
```json
{
    "transaction_id": "YOUR_TRANSACTION_ID_HERE"
}
```
*หมายเหตุ: `transaction_id` ได้มาจาก response ตอนยืม หรือดูจาก History*

### 👉 ดูประวัติการยืม (History)
- **Method:** `GET`
- **URL:** `http://localhost:3000/history/YOUR_USER_ID_HERE`
