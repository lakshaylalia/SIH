## API Documentation

### Base URL

`/api/v1/`

---

### Authentication Routes

#### Register User

**POST** `/api/v1/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "documentId": "ABC123",
  "number": "+919876543210",
  "avatarImage": "/images/defaultUserImage.webp",
  "role": "volunteer"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
	    "_id": "68c9ab9bed4634db3d2ed601",
	    "name": "test",
	    "email": "testn@gmail.com",
	    "uniqueId": "ZRKEU62T9RFO",
	    "documentId": "123456",
	    "number": "+919876543210",
	    "avatarImage": "/images/defaultUserImage.webp",
	    "role": "ashaWorker",
    }
    "token": "<JWT Token>"
  },
  "message": "User created successfully"
}
```

**Set-Cookie:** `token=<JWT Token>`

---

#### Login with Email

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
    "user": {
		"_id": "68c9ab9bed4634db3d2ed601",
		"name": "test",
		"email": "testn@gmail.com",
		"uniqueId": "ZRKEU62T9RFO",
		"documentId": "123456",
		"number": "+919876543210",
		"avatarImage": "/images/defaultUserImage.webp",
		"role": "test role",
        }
    "token": "<JWT Token>"
  },
  "message": "User logged in successfully"
}
```

**Set-Cookie:** `token=<JWT Token>`

---

#### Send OTP to Email

**POST** `/api/v1/auth/generate-otp-mail`

**Request Body:**

```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": null,
  "message": "OTP sent to email successfully"
}
```

---

#### Verify Email OTP

**POST** `/api/v1/auth/verify-email`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Email verified successfully"
}
```

---

#### Send OTP to Phone

**POST** `/api/v1/auth/generate-otp-number`

**Request Body:**

```json
{
  "number": "+919876543210"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": null,
  "message": "OTP sent to phone successfully"
}
```

---

#### Verify Phone OTP

**POST** `/api/v1/auth/verify-number`

**Request Body:**

```json
{
  "number": "+919876543210",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Phone number verified successfully"
}
```

---

#### Login with OTP

**POST** `/api/v1/auth/login-otp`

**Request Body:**

```json
{
  "number": "+919876543210",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "68c9ab9bed4634db3d2ed601",
      "name": "test",
      "email": "testn@gmail.com",
      "uniqueId": "ZRKEU62T9RFO",
      "documentId": "123456",
      "number": "+919876543210",
      "avatarImage": "/images/defaultUserImage.webp",
      "role": "test role"
    },
    "token": "<JWT Token>"
  },
  "message": "User logged in successfully"
}
```

**Set-Cookie:** `token=<JWT Token>`

---

#### Logout User

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

### User Object Example

```json
{
  "_id": "68c9ab9bed4634db3d2ed601",
  "name": "test",
  "email": "testn@gmail.com",
  "uniqueId": "ZRKEU62T9RFO",
  "documentId": "123456",
  "number": "+919876543210",
  "avatarImage": "/images/defaultUserImage.webp",
  "role": "test role"
}
```

#### User Object Fields

| Field       | Type   | Description                                                      |
| ----------- | ------ | ---------------------------------------------------------------- |
| \_id        | String | Unique MongoDB identifier for the user                           |
| name        | String | Full name of the user                                            |
| email       | String | User's email address                                             |
| password    | String | Hashed password (never plain text)                               |
| uniqueId    | String | System-generated unique user ID                                  |
| documentId  | String | Unique document/identity number for the user                     |
| number      | String | User's phone number (with country code, e.g., +91...)            |
| avatarImage | String | Path to user's avatar image                                      |
| role        | String | User's role: one of `volunteer`, `clinic`, `ashaWorker`, `admin` |
| createdAt   | String | ISO timestamp of user creation                                   |
| updatedAt   | String | ISO timestamp of last update                                     |
| \_\_v       | Number | Mongoose schema version key                                      |

### OTP Schema

```json
{
  "userIndentifier": "email or number",
  "otp": "hashed",
  "createdAt": "date"
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
