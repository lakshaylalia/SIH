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


---

### Report Endpoints

#### Create Medical Report
**POST** `/api/v1/report/`

**Headers:**
- `Authorization: Bearer <JWT Token>`
- `Content-Type: multipart/form-data`

**Body (multipart/form-data):**
- `medicalReport` (file, required if disease is present)
- `name` (string, required)
- `age` (number, required)
- `gender` (string, required: male|female|other)
- `contact` (string, required, e.g. +919876543210)
- `tehsil`, `district`, `state`, `pinCode`, `latitude`, `longitude` (all required)
- `landmark` (string, optional)
- `documentId` (string, required)
- `disease` (string, optional)
- `symptoms` (array of string, required)

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "_id": "...",
    "name": "...",
    "age": 30,
    "gender": "male",
    "contact": "+919876543210",
    "address": {
      "tehsil": "...",
      "district": "...",
      "state": "...",
      "pinCode": "...",
      "landmark": "...",
      "latitude": 28.6,
      "longitude": 77.2
    },
    "documentId": "...",
    "disease": "...",
    "medicalReport": "https://...cloudinary.com/...",
    "symptoms": ["fever", "cough"],
    "reportedBy": "<userId>",
  },
  "message": "Report created successfully."
}
```

#### Report Object Fields
| Field | Type | Description |
|-------|------|-------------|
| _id | String | Unique report ID |
| name | String | Patient name |
| age | Number | Patient age |
| gender | String | male, female, or other |
| contact | String | Patient phone number (+91...) |
| address | Object | Address details (see below) |
| documentId | String | Patient's document/identity number |
| disease | String | Diagnosed disease (optional) |
| medicalReport | String | URL to uploaded medical report (if any) |
| symptoms | Array | List of symptoms |
| reportedBy | String | User ID of reporter |
| createdAt | String | ISO timestamp |
| updatedAt | String | ISO timestamp |

**Address Object:**
| Field | Type | Description |
|-------|------|-------------|
| tehsil | String | Tehsil |
| district | String | District |
| state | String | State |
| pinCode | String | PIN code |
| landmark | String | Landmark (optional) |
| latitude | Number | Latitude |
| longitude | Number | Longitude |

---

### Water Sample Endpoints

#### Create Water Sample
**POST** `/api/v1/sample/`

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "phLevel": 7.2,
  "turbidityNTU": 2.5,
  "chlorineConcentrationPPM": 0.5,
  "bacterialCountCFU": 100,
  "latitude": 28.6,
  "longitude": 77.2
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "_id": "...",
    "phLevel": 7.2,
    "turbidityNTU": 2.5,
    "chlorineConcentrationPPM": 0.5,
    "bacterialCountCFU": 100,
    "rainfallMM": 0,
    "temperatureCelsius": 30,
    "relativeHumidityPercent": 60,
    "collectedBy": "<userId>",
    "collectionLocation": {
      "latitude": 28.6,
      "longitude": 77.2,
      "locationName": null
    },
    "sampleStatus": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Water quality sample created successfully"
}
```

#### Get All Water Samples
**GET** `/api/v1/sample/`

**Headers:**
- `Authorization: Bearer <JWT Token>`

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": [
    {
      "_id": "...",
      "phLevel": 7.2,
      "turbidityNTU": 2.5,
      "chlorineConcentrationPPM": 0.5,
      "bacterialCountCFU": 100,
      "rainfallMM": 0,
      "temperatureCelsius": 30,
      "relativeHumidityPercent": 60,
      "collectedBy": "<userId>",
      "collectionLocation": {
        "latitude": 28.6,
        "longitude": 77.2,
        "locationName": null
      },
      "sampleStatus": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Water samples found"
}
```

#### Water Sample Object Fields
| Field | Type | Description |
|-------|------|-------------|
| _id | String | Unique sample ID |
| phLevel | Number | pH level (0-14) |
| turbidityNTU | Number | Turbidity in NTU |
| chlorineConcentrationPPM | Number | Chlorine concentration in PPM |
| bacterialCountCFU | Number | Bacterial count in CFU |
| rainfallMM | Number | Rainfall in mm |
| temperatureCelsius | Number | Temperature in Celsius |
| relativeHumidityPercent | Number | Relative humidity (%) |
| collectedBy | String | User ID of collector |
| collectionLocation | Object | Location details |
| sampleStatus | String | pending, analyzed, approved, rejected |
| createdAt | String | ISO timestamp |
| updatedAt | String | ISO timestamp |

**Collection Location Object:**
| Field | Type | Description |
|-------|------|-------------|
| latitude | Number | Latitude |
| longitude | Number | Longitude |
| locationName | String | Name/description (optional) |

---

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
