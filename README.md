## API Documentation

### Base URL

`/api/v1/`

---

### 1. Register User
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
	"firstName": "John",
	"lastName": "Doe",
	"email": "john@example.com",
	"password": "yourpassword",
	"documentId": "ABC123",
	"phoneNumber": "9876543210",
	"age": 25,
	"gender": "male"
}
```
**Response:**
```json
{
	"success": true,
	"statusCode": 201,
	"data": {
		"user": { /* user object */ },
		"token": "<JWT Token>"
	},
	"message": "User created successfully"
}
```
**Set-Cookie:** `token=<JWT Token>`

---

### 2. Generate OTP
**POST** `/api/v1/auth/generate-otp`

**Request Body:**
```json
{
	"phoneNumber": "9876543210"
}
```
**Response:**
```json
{
	"success": true,
	"statusCode": 201,
	"data": null,
	"message": "OTP sent successfully"
}
```

---

### 3. Resend OTP
**POST** `/api/v1/auth/resend-otp`

**Request Body:**
```json
{
	"phoneNumber": "9876543210"
}
```
**Response:**
```json
{
	"success": true,
	"statusCode": 200,
	"data": null,
	"message": "OTP resent successfully"
}
```

---

### 4. Login with OTP
**POST** `/api/v1/auth/login-otp`

**Request Body:**
```json
{
	"number": "9876543210",
	"otp": "123456"
}
```
**Response:**
```json
{
	"success": true,
	"statusCode": 201,
	"data": {
		"user": { /* user object */ },
		"token": "<JWT Token>"
	},
	"message": "User logged in successfully"
}
```
**Set-Cookie:** `token=<JWT Token>`

---

### 5. Login with Email
**POST** `/api/v1/auth/login-email`

**Request Body:**
```json
{
	"email": "john@example.com",
	"password": "yourpassword"
}
```
**Response:**
```json
{
	"success": true,
	"statusCode": 200,
	"data": {
		"user": { /* user object */ },
		"token": "<JWT Token>"
	},
	"message": "User logged in successfully"
}
```
**Set-Cookie:** `token=<JWT Token>`

---

### 6. Logout User
**POST** `/api/v1/auth/logout`

**Headers:**
`Cookie: token=<JWT Token>`

**Response:**
```json
{
	"success": true,
	"statusCode": 200,
	"data": null,
	"message": "User logged out successfully"
}
```

---

### Common Headers
- `Content-Type: application/json`
- `Cookie: token=<JWT Token>` (for authenticated routes)

---

### Error Response Example
```json
{
	"success": false,
	"statusCode": 400,
	"message": "Error message"
}
```
