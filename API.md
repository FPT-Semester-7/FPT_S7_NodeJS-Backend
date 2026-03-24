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
*   **Endpoint:** `/api/v1/mcs/profile`
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

---

## 7. Conversations API

### Danh sách cuộc trò chuyện
*   **Endpoint:** `/api/v1/conversations`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "conversations": [
      {
        "_id": "67f0c...",
        "participants": [
          { "_id": "65f1e...", "name": "Nguyen Van A", "role": "client" },
          { "_id": "65f1f...", "name": "Tran Thanh", "role": "mc" }
        ],
        "lastMessage": {
          "_id": "67f0d...",
          "type": "text",
          "content": "Chào anh/chị, em xác nhận lịch nhé"
        },
        "currentBookingId": "67eabc...",
        "currentBooking": {
          "_id": "67eabc...",
          "eventName": "FPT Annual Gala",
          "eventDate": "2026-03-30T12:00:00.000Z",
          "status": "Pending"
        },
        "updatedAt": "2026-03-22T08:20:00.000Z"
      }
    ]
  }
}
```

### Chi tiết cuộc trò chuyện
*   **Endpoint:** `/api/v1/conversations/:id`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "conversation": {
      "_id": "67f0c...",
      "participants": [
        { "_id": "65f1e...", "name": "Nguyen Van A", "role": "client" },
        { "_id": "65f1f...", "name": "Tran Thanh", "role": "mc" }
      ],
      "currentBookingId": "67eabc...",
      "currentBooking": {
        "_id": "67eabc...",
        "eventName": "FPT Annual Gala",
        "eventDate": "2026-03-30T12:00:00.000Z",
        "status": "Accepted"
      },
      "isActive": true
    }
  }
}
```

### System message format (Booking marker)
*   **Payload mẫu trong messages:**
```json
{
  "type": "system",
  "content": "--- Booking mới #67eabc... bắt đầu ---",
  "bookingId": "67eabc...",
  "createdAt": "2026-03-22T08:21:10.000Z"
}
```

---

## 8. Payments API

### Tạo payment
*   **Endpoint:** `/api/v1/payments`
*   **Method:** `POST` (Yêu cầu Token, role: `client`)
*   **Request Body:**
```json
{
  "booking": "67eabc...",
  "client": "65f1e...",
  "mc": "65f1f...",
  "amount": 5000000,
  "type": "Deposit",
  "status": "Pending"
}
```
*   **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "_id": "67f10...",
      "booking": "67eabc...",
      "amount": 5000000,
      "status": "Pending"
    }
  }
}
```

### Lịch sử thanh toán
*   **Endpoint:** `/api/v1/payments/history`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "transactions": [
      {
        "_id": "67f10...",
        "amount": 5000000,
        "type": "Deposit",
        "status": "Completed"
      }
    ]
  }
}
```

### Cập nhật trạng thái payment
*   **Endpoint:** `/api/v1/payments/:id/status`
*   **Method:** `PATCH` (Yêu cầu Token, role: `admin` hoặc `mc`)
*   **Request Body:**
```json
{
  "status": "Completed"
}
```
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "_id": "67f10...",
      "status": "Completed"
    }
  }
}
```

---

## 9. Availability API

### Xem lịch rảnh/bận của MC
*   **Endpoint:** `/api/v1/availability/:mcId`
*   **Method:** `GET`
*   **Response (200 OK):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "availabilities": [
      {
        "_id": "67f20...",
        "mc": "65f1f...",
        "date": "2026-03-28T00:00:00.000Z",
        "startTime": "18:00",
        "endTime": "22:00",
        "status": "Busy"
      }
    ]
  }
}
```

### Tạo availability
*   **Endpoint:** `/api/v1/availability`
*   **Method:** `POST` (Yêu cầu Token, role: `mc` hoặc `admin`)
*   **Request Body:**
```json
{
  "date": "2026-03-28",
  "startTime": "18:00",
  "endTime": "22:00",
  "status": "Busy"
}
```
*   **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "availability": {
      "_id": "67f20...",
      "mc": "65f1f...",
      "status": "Busy"
    }
  }
}
```

### Xóa availability
*   **Endpoint:** `/api/v1/availability/:id`
*   **Method:** `DELETE` (Yêu cầu Token, role: `mc` hoặc `admin`)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Availability deleted"
}
```

---

## 10. Notifications API

### Danh sách thông báo
*   **Endpoint:** `/api/v1/notifications`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "notifications": [
      {
        "_id": "67f30...",
        "title": "New Booking Request",
        "type": "booking_request",
        "isRead": false,
        "createdAt": "2026-03-22T08:30:00.000Z"
      }
    ]
  }
}
```

### Số lượng chưa đọc
*   **Endpoint:** `/api/v1/notifications/unread-count`
*   **Method:** `GET` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "count": 2
  }
}
```

### Đánh dấu đã đọc tất cả
*   **Endpoint:** `/api/v1/notifications/read-all`
*   **Method:** `PATCH` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "message": "All notifications marked as read"
}
```

### Đánh dấu đã đọc theo id
*   **Endpoint:** `/api/v1/notifications/:id/read`
*   **Method:** `PATCH` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

### Xóa tất cả thông báo
*   **Endpoint:** `/api/v1/notifications/clear-all`
*   **Method:** `DELETE` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "message": "All notifications deleted"
}
```

### Xóa thông báo theo id
*   **Endpoint:** `/api/v1/notifications/:id`
*   **Method:** `DELETE` (Yêu cầu Token)
*   **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Notification deleted"
}
```
