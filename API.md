# The MC Hub - API Documentation

Hệ thống cung cấp các API để kết nối khách hàng và người dẫn chương trình (MC). Tất cả yêu cầu và phản hồi đều sử dụng định dạng dữ liệu **JSON**.

---

## 1. Authentication (Xác thực)

### Đăng ký tài khoản
*   **Endpoint:** `/api/v1/auth/register`
*   **Method:** `POST`
*   **Request Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "mc.an@example.com",
  "password": "password123",
  "role": "mc",
  "phoneNumber": "0901234567"
}
```
*   **Response (201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "65f1e...",
      "name": "Nguyen Van A",
      "email": "mc.an@example.com",
      "role": "mc",
      "isVerified": false
    }
  }
}
```

### Đăng nhập
*   **Endpoint:** `/api/v1/auth/login`
*   **Method:** `POST`
*   **Request Body:**
```json
{
  "email": "mc.an@example.com",
  "password": "password123"
}
```
*   **Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "65f1e...",
      "name": "Nguyen Van A",
      "role": "mc"
    }
  }
}
```

---

## 2. MC Talent Side (Dành cho MC)

### Cập nhật hồ sơ năng lực (Onboarding)
*   **Endpoint:** `/api/v1/mcs/onboarding`
*   **Method:** `PUT` (Yêu cầu Token)
*   **Request Body:**
```json
{
  "experience": 5,
  "niche": "Wedding",
  "languages": ["Vietnamese", "English"],
  "media": [
    { "url": "https://img.com/hero.jpg", "type": "image" }
  ]
}
```
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "profile": {
      "experience": 5,
      "eventTypes": ["Wedding"],
      "status": "Available"
    }
  }
}
```

### Dashboard Thống kê
*   **Endpoint:** `/api/v1/mcs/dashboard`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "profileStatus": "Available",
    "completionPercentage": 85,
    "stats": {
      "totalBookings": 12,
      "revenue": 50000000
    }
  }
}
```

---

## 3. Public Discovery (Khám phá công khai)

### Tìm kiếm MC
*   **Endpoint:** `/api/v1/public/mcs`
*   **Method:** `GET`
*   **Query Params:** `?region=Hanoi&style=Fun`
*   **Response (200 OK):**
```json
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "id": "65f1f...",
      "user": { "name": "Tran Thanh", "avatar": "tt.jpg" },
      "experience": 10,
      "rating": 4.9
    }
  ]
}
```

---

## 4. Bookings (Đặt lịch)

### Tạo yêu cầu đặt lịch
*   **Endpoint:** `/api/v1/bookings`
*   **Method:** `POST` (Yêu cầu Token Client)
*   **Request Body:**
```json
{
  "mcId": "65f1f...",
  "eventDate": "2024-12-25T18:00:00Z",
  "venue": "Grand Plaza Hotel",
  "duration": "4h",
  "totalPrice": 10000000,
  "requirements": "Dẫn đám cưới phong cách hiện đại"
}
```
*   **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": "65f2a...",
      "status": "Pending",
      "totalPrice": 10000000
    }
  }
}
```

---

## 5. Scripts Library (Thư viện kịch bản)

### Danh sách kịch bản
*   **Endpoint:** `/api/v1/scripts`
*   **Method:** `GET`
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "65f3c...",
      "title": "Kịch bản tiệc tất niên",
      "category": "Corporate",
      "isPremium": false
    }
  ]
}
```

---

## 6. Feedback & Settings

### Gửi đánh giá
*   **Endpoint:** `/api/v1/reviews`
*   **Method:** `POST`
*   **Request Body:**
```json
{
  "bookingId": "65f2a...",
  "rating": 5,
  "comment": "Rất hài lòng với phần dẫn dắt của MC"
}
```

### Xác minh KYC
*   **Endpoint:** `/api/v1/auth/kyc`
*   **Method:** `POST`
*   **Request Body:**
```json
{
  "idNumber": "00123456789",
  "selfieUrl": "https://img.com/selfie.jpg",
  "idCardFront": "https://img.com/front.jpg"
}
```
