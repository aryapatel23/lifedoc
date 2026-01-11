# 📡 LifeDoc API Documentation

Complete reference for all API endpoints, authentication, request/response formats, and error handling.

---

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [AI Services](#ai-services-endpoints)
  - [Measurements](#measurements-endpoints)
  - [Lab Reports](#lab-reports-endpoints)
  - [Doctor Reports](#doctor-reports-endpoints)
  - [Appointments](#appointments-endpoints)
  - [Diary](#diary-endpoints)
  - [Family Management](#family-management-endpoints)
  - [Medicine Reference](#medicine-reference-endpoints)
  - [Emergency SOS](#emergency-sos-endpoints)
  - [Doctor Verification](#doctor-verification-endpoints)
  - [Doctors & Appointments](#doctors-and-appointments-endpoints)
  - [Meeting Requests](#meeting-requests-endpoints)
  - [Consultation Reviews](#consultation-reviews-endpoints)
  - [Premium Subscriptions](#premium-subscriptions-endpoints)
  - [Saved Posts](#saved-posts-endpoints)
  - [Admin](#admin-endpoints)
  - [News](#news-endpoints)

---

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.lifedoc.app/api
```

---

## Authentication

### JWT Token Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Details

- **Token Expiry**: 24 hours
- **Token Format**: JWT (JSON Web Token)
- **Token Payload**: `{ id: userId, type: userType, iat: timestamp, exp: expiry }`

### Getting a Token

1. Sign up using `/api/auth/signup`
2. Verify OTP using `/api/auth/verify-otp`
3. Login using `/api/auth/login` (returns JWT token)
4. Include token in all subsequent requests

---

## Rate Limiting

Rate limits are applied per IP address and per user to prevent abuse.

| Endpoint Type | Limit | Window | Scope |
|---------------|-------|--------|-------|
| **Default** | 100 requests | 15 minutes | Per IP |
| **AI Endpoints** | 20 requests | 15 minutes | Per User |
| **File Upload** | 10 requests | 15 minutes | Per User |
| **Authentication** | 5 requests | 15 minutes | Per IP |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641024000
```

---

## Error Handling

All API errors follow a consistent JSON format:

### Error Response Format

```json
{
  "message": "User-friendly error description",
  "error": "Detailed technical error message",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| **200** | OK | Successful GET/PUT/DELETE request |
| **201** | Created | Successful POST request |
| **400** | Bad Request | Invalid request body, missing required fields |
| **401** | Unauthorized | Missing or invalid JWT token |
| **403** | Forbidden | Valid token but insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side error |

### Common Error Examples

#### Invalid Token
```json
{
  "message": "Invalid or expired token",
  "error": "JsonWebTokenError: invalid signature",
  "statusCode": 401
}
```

#### Missing Required Field
```json
{
  "message": "Validation failed",
  "error": "Name is required",
  "statusCode": 400
}
```

#### Rate Limit Exceeded
```json
{
  "message": "Too many requests, please try again later",
  "statusCode": 429
}
```

---

## Endpoints

---

## Authentication Endpoints

Base path: `/api/auth`

### 1. Sign Up

Create a new user account and send OTP for verification.

**Endpoint:** `POST /api/auth/signup`  
**Authentication:** ❌ Not Required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 35
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters
- `age`: Optional, 1-120

**Success Response:** `200 OK`
```json
{
  "message": "OTP sent to email",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error Responses:**
```json
// Email already exists
{
  "message": "Email already registered",
  "statusCode": 400
}

// Invalid email format
{
  "message": "Invalid email format",
  "statusCode": 400
}
```

---

### 2. Verify OTP

Verify the OTP sent during signup and activate the account.

**Endpoint:** `POST /api/auth/verify-otp`  
**Authentication:** ❌ Not Required

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "otp": "123456"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Account verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user",
    "isVerified": true
  }
}
```

**Error Responses:**
```json
// Invalid or expired OTP
{
  "message": "Invalid or expired OTP",
  "statusCode": 400
}
```

---

### 3. Login

Authenticate user with email and password.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** ❌ Not Required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user",
    "isVerified": true,
    "age": 35
  }
}
```

**Error Responses:**
```json
// Invalid credentials
{
  "message": "Invalid email or password",
  "statusCode": 401
}

// Account not verified
{
  "message": "Please verify your email first",
  "statusCode": 401
}
```

---

### 4. Get Profile

Retrieve current user's profile information.

**Endpoint:** `GET /api/auth/profile`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 35,
  "type": "user",
  "isVerified": true,
  "profile": {
    "gender": "male",
    "height": 175,
    "weight": 75,
    "bloodGroup": "O+",
    "chronicConditions": ["Diabetes Type 2", "Hypertension"]
  },
  "sosContacts": [
    {
      "name": "Jane Doe",
      "phone": "+1234567890",
      "email": "jane@example.com",
      "relationship": "Spouse"
    }
  ]
}
```

---

### 5. Update Profile

Update user profile information.

**Endpoint:** `PUT /api/auth/profile`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "name": "John Smith",
  "age": 36,
  "profile": {
    "gender": "male",
    "height": 175,
    "weight": 73,
    "bloodGroup": "O+",
    "chronicConditions": ["Diabetes Type 2"]
  }
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "age": 36,
    "profile": {
      "gender": "male",
      "height": 175,
      "weight": 73,
      "bloodGroup": "O+",
      "chronicConditions": ["Diabetes Type 2"]
    }
  }
}
```

---

### 6. Update SOS Contacts

Manage emergency contacts for SOS alerts.

**Endpoint:** `PUT /api/auth/sos-contacts`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "sosContacts": [
    {
      "name": "Jane Doe",
      "phone": "+1234567890",
      "email": "jane@example.com",
      "relationship": "Spouse"
    },
    {
      "name": "Mike Johnson",
      "phone": "+0987654321",
      "email": "mike@example.com",
      "relationship": "Brother"
    }
  ]
}
```

**Validation Rules:**
- Maximum 5 contacts
- `name`: Required
- `phone`: Required, valid phone format
- `email`: Optional, valid email format
- `relationship`: Optional

**Success Response:** `200 OK`
```json
{
  "message": "SOS contacts updated successfully",
  "sosContacts": [...]
}
```

---

## AI Services Endpoints

Base path: `/api/ai`

### 1. Symptom Analysis

Get AI-powered symptom analysis with recommendations.

**Endpoint:** `POST /api/ai/analyze`  
**Authentication:** ✅ Required  
**Rate Limit:** 20 requests per 15 minutes

**Request Body:**
```json
{
  "text": "I have been experiencing severe headaches for 3 days, along with dizziness and nausea",
  "language": "en"
}
```

**Parameters:**
- `text`: Required, symptom description (10-2000 characters)
- `language`: Optional, default "en" (options: "en", "hi", "gu")

**Success Response:** `200 OK`
```json
{
  "summary": "Based on your symptoms, you may be experiencing tension headaches or migraines. The combination of headaches, dizziness, and nausea suggests you should seek medical attention.",
  "urgency": "Medium",
  "actions": [
    "Stay hydrated - drink at least 8 glasses of water today",
    "Rest in a dark, quiet room",
    "Monitor symptoms for 24 hours",
    "Consult a doctor if symptoms worsen",
    "Avoid bright screens and loud noises"
  ],
  "lifestyleAdvice": [
    "Maintain regular sleep schedule (7-8 hours)",
    "Reduce screen time before bed",
    "Practice stress management techniques",
    "Avoid skipping meals"
  ],
  "suggestedMedicines": [
    "Paracetamol 500mg (consult doctor first)",
    "Ibuprofen 200mg for pain relief"
  ],
  "tokenUsage": {
    "promptTokens": 150,
    "completionTokens": 280,
    "totalTokens": 430
  },
  "consultationId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Urgency Levels:**
- **Low**: Minor symptoms, self-care possible
- **Medium**: Moderate symptoms, consult doctor within 24-48 hours
- **High**: Severe symptoms, seek immediate medical attention

---

### 2. Analyze Prescription

Extract structured data from prescription images using Vision AI.

**Endpoint:** `POST /api/ai/analyze-prescription`  
**Authentication:** ✅ Required  
**Rate Limit:** 10 requests per 15 minutes

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../prescription.jpg"
}
```

**Alternative (Base64):**
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Success Response:** `200 OK`
```json
{
  "medicines": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "30 days",
      "instructions": "Take after meals"
    },
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning"
    }
  ],
  "doctorName": "Dr. Sarah Johnson",
  "prescriptionDate": "2026-01-05",
  "hospitalName": "City General Hospital",
  "notes": "Follow-up appointment in 4 weeks"
}
```

**Error Responses:**
```json
// No text detected
{
  "message": "Could not extract text from image",
  "statusCode": 400
}

// Invalid image format
{
  "message": "Only JPEG and PNG images are supported",
  "statusCode": 400
}
```

---

### 3. Analyze Lab Report

Parse lab reports and extract test results.

**Endpoint:** `POST /api/ai/analyze-lab-report`  
**Authentication:** ✅ Required  
**Rate Limit:** 10 requests per 15 minutes

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../lab-report.pdf",
  "reportType": "blood_test"
}
```

**Success Response:** `200 OK`
```json
{
  "testName": "Complete Blood Count (CBC)",
  "reportDate": "2026-01-08",
  "labName": "MediLab Diagnostics",
  "results": [
    {
      "testName": "Hemoglobin",
      "value": "13.5",
      "unit": "g/dL",
      "referenceRange": "13.0 - 17.0",
      "status": "normal"
    },
    {
      "testName": "WBC Count",
      "value": "11.2",
      "unit": "10^3/μL",
      "referenceRange": "4.0 - 10.0",
      "status": "high",
      "flag": "H"
    },
    {
      "testName": "Platelet Count",
      "value": "250",
      "unit": "10^3/μL",
      "referenceRange": "150 - 400",
      "status": "normal"
    }
  ],
  "summary": "Your CBC results show slightly elevated white blood cells, which may indicate an infection or inflammation. Other values are within normal range.",
  "abnormalFlags": [
    {
      "test": "WBC Count",
      "value": "11.2",
      "concern": "Mild elevation - consult doctor"
    }
  ]
}
```

---

### 4. Summarize Diary Entry

Generate AI summary of health diary entry.

**Endpoint:** `POST /api/ai/summerizer`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "text": "Today I woke up feeling refreshed after 8 hours of sleep. Had a healthy breakfast with oats and fruits. Went for a 30-minute walk in the morning. Blood pressure was 120/80. Took my diabetes medication on time. Felt a bit tired in the afternoon but recovered after a short nap. Overall, a good day with no health issues.",
  "date": "2026-01-10"
}
```

**Success Response:** `200 OK`
```json
{
  "summary": "Good health day with 8 hours sleep, healthy diet, 30-min exercise. BP normal (120/80). Medication adherence maintained. Afternoon fatigue resolved with rest.",
  "mood": "positive",
  "highlights": [
    "8 hours quality sleep",
    "Regular exercise",
    "Normal blood pressure",
    "Medication adherence"
  ],
  "concerns": [
    "Mild afternoon fatigue (resolved)"
  ],
  "suggestedTags": ["good_sleep", "exercise", "medication", "healthy_diet"]
}
```

---

## Measurements Endpoints

Base path: `/api/measurements`

### 1. Add Measurement

Record a new vital sign measurement.

**Endpoint:** `POST /api/measurements`  
**Authentication:** ✅ Required

**Request Body (Blood Pressure):**
```json
{
  "type": "blood_pressure",
  "value": {
    "systolic": 120,
    "diastolic": 80
  },
  "unit": "mmHg",
  "timestamp": "2026-01-10T08:30:00Z",
  "notes": "Morning reading before breakfast"
}
```

**Request Body (Blood Glucose):**
```json
{
  "type": "glucose",
  "value": 95,
  "unit": "mg/dL",
  "timestamp": "2026-01-10T09:00:00Z",
  "context": "fasting"
}
```

**Request Body (Weight):**
```json
{
  "type": "weight",
  "value": 75.5,
  "unit": "kg",
  "timestamp": "2026-01-10T07:00:00Z"
}
```

**Supported Types:**
- `blood_pressure`: Systolic/Diastolic (mmHg)
- `glucose`: Blood sugar (mg/dL)
- `heart_rate`: BPM
- `weight`: kg or lbs
- `temperature`: °C or °F
- `spo2`: Oxygen saturation (%)

**Success Response:** `201 Created`
```json
{
  "message": "Measurement added successfully",
  "measurement": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "507f1f77bcf86cd799439011",
    "type": "blood_pressure",
    "value": {
      "systolic": 120,
      "diastolic": 80
    },
    "unit": "mmHg",
    "timestamp": "2026-01-10T08:30:00Z",
    "notes": "Morning reading before breakfast"
  }
}
```

---

### 2. Get Measurements

Retrieve measurement history with filtering.

**Endpoint:** `GET /api/measurements`  
**Authentication:** ✅ Required

**Query Parameters:**
- `type`: Filter by measurement type (e.g., `blood_pressure`)
- `startDate`: ISO date (e.g., `2026-01-01`)
- `endDate`: ISO date (e.g., `2026-01-10`)
- `limit`: Number of results (default: 50, max: 100)
- `sort`: Sort order (`asc` or `desc`, default: `desc`)

**Example Request:**
```
GET /api/measurements?type=blood_pressure&startDate=2026-01-01&limit=10
```

**Success Response:** `200 OK`
```json
{
  "measurements": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "type": "blood_pressure",
      "value": {
        "systolic": 120,
        "diastolic": 80
      },
      "unit": "mmHg",
      "timestamp": "2026-01-10T08:30:00Z",
      "notes": "Morning reading"
    },
    // ... more measurements
  ],
  "count": 10,
  "total": 45
}
```

---

### 3. Update Measurement

Update an existing measurement.

**Endpoint:** `PUT /api/measurements/:id`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "value": {
    "systolic": 118,
    "diastolic": 78
  },
  "notes": "Corrected reading - morning before breakfast"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Measurement updated successfully",
  "measurement": { ... }
}
```

---

### 4. Delete Measurement

Delete a measurement record.

**Endpoint:** `DELETE /api/measurements/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "message": "Measurement deleted successfully"
}
```

---

## Lab Reports Endpoints

Base path: `/api/lab-reports`

### 1. Upload Lab Report

Upload and parse a lab report document.

**Endpoint:** `POST /api/lab-reports`  
**Authentication:** ✅ Required  
**Content-Type:** `multipart/form-data`

**Form Data:**
```
file: <PDF or Image file>
reportDate: "2026-01-08"
testType: "Complete Blood Count"
notes: "Annual checkup"
```

**Success Response:** `201 Created`
```json
{
  "message": "Lab report uploaded successfully",
  "report": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "507f1f77bcf86cd799439011",
    "reportDate": "2026-01-08",
    "testType": "Complete Blood Count",
    "fileUrl": "https://res.cloudinary.com/.../lab_report.pdf",
    "parsedResults": { ... },
    "notes": "Annual checkup",
    "uploadedAt": "2026-01-10T10:00:00Z"
  }
}
```

---

### 2. Get Lab Reports

Retrieve lab report history.

**Endpoint:** `GET /api/lab-reports`  
**Authentication:** ✅ Required

**Query Parameters:**
- `startDate`: Filter from date
- `endDate`: Filter to date
- `testType`: Filter by test type
- `limit`: Results per page (default: 20)

**Success Response:** `200 OK`
```json
{
  "reports": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "reportDate": "2026-01-08",
      "testType": "Complete Blood Count",
      "fileUrl": "https://...",
      "parsedResults": { ... }
    }
  ],
  "count": 10
}
```

---

### 3. Get Single Lab Report

Retrieve detailed lab report.

**Endpoint:** `GET /api/lab-reports/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "reportDate": "2026-01-08",
  "testType": "Complete Blood Count",
  "fileUrl": "https://res.cloudinary.com/.../lab_report.pdf",
  "parsedResults": {
    "results": [ ... ],
    "summary": "...",
    "abnormalFlags": [ ... ]
  },
  "notes": "Annual checkup",
  "uploadedAt": "2026-01-10T10:00:00Z"
}
```

---

### 4. Delete Lab Report

Delete a lab report.

**Endpoint:** `DELETE /api/lab-reports/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "message": "Lab report deleted successfully"
}
```

---

## Doctor Reports Endpoints

Base path: `/api/doctor-reports`

### 1. Create Doctor Report

Record a doctor visit with prescriptions.

**Endpoint:** `POST /api/doctor-reports`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "visitDate": "2026-01-09",
  "doctorName": "Dr. Sarah Johnson",
  "specialty": "Endocrinologist",
  "hospitalName": "City General Hospital",
  "diagnosis": ["Type 2 Diabetes", "Hypertension"],
  "prescriptions": [
    {
      "medicine": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "30 days"
    }
  ],
  "notes": "Follow-up in 4 weeks",
  "fileUrl": "https://..." // Optional prescription image
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Doctor report created successfully",
  "report": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "visitDate": "2026-01-09",
    "doctorName": "Dr. Sarah Johnson",
    "diagnosis": ["Type 2 Diabetes", "Hypertension"],
    "prescriptions": [ ... ]
  }
}
```

---

### 2. Get Doctor Reports

Retrieve doctor visit history.

**Endpoint:** `GET /api/doctor-reports`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "reports": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "visitDate": "2026-01-09",
      "doctorName": "Dr. Sarah Johnson",
      "diagnosis": ["Type 2 Diabetes"],
      "prescriptions": [ ... ]
    }
  ]
}
```

---

## Emergency SOS Endpoints

Base path: `/api/sos`

### 1. Send SOS Alert

Send emergency alert to all SOS contacts.

**Endpoint:** `POST /api/sos/alert`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "123 Main St, San Francisco, CA"
  },
  "message": "Emergency! Please help immediately.",
  "severity": "critical"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "SOS alert sent successfully",
  "alertsSent": 3,
  "contacts": [
    {
      "name": "Jane Doe",
      "phone": "+1234567890",
      "status": "sent"
    }
  ],
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "googleMapsUrl": "https://maps.google.com/?q=37.7749,-122.4194"
  }
}
```

---

## Family Management Endpoints

Base path: `/api/family`

### 1. Create Family Group

Create a new family group (user becomes admin).

**Endpoint:** `POST /api/family`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "familyName": "The Smiths"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Family group created successfully",
  "family": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "adminId": "507f1f77bcf86cd799439011",
    "familyName": "The Smiths",
    "members": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "role": "admin",
        "joinedAt": "2026-01-10T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. Add Family Member

Invite or add a member to family group.

**Endpoint:** `POST /api/family/members`  
**Authentication:** ✅ Required (Admin only)

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "caregiver",
  "relationship": "spouse"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Invitation sent successfully",
  "member": {
    "email": "member@example.com",
    "role": "caregiver",
    "status": "pending"
  }
}
```

---

### 3. Get Family Members

View all family members and their health summaries.

**Endpoint:** `GET /api/family/members`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "family": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "familyName": "The Smiths",
    "members": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "role": "admin",
        "healthSummary": {
          "lastCheckup": "2026-01-05",
          "chronicConditions": ["Diabetes"],
          "recentMeasurements": { ... }
        }
      }
    ]
  }
}
```

---

### 4. Analyze Family Health

Get AI-powered family health insights.

**Endpoint:** `POST /api/family/analyze`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "summary": "Overall family health is good. John needs to monitor blood sugar levels more regularly. All members are up-to-date with medications.",
  "insights": [
    {
      "member": "John Doe",
      "concerns": ["Irregular blood sugar monitoring"],
      "recommendations": ["Check glucose daily", "Schedule endocrinologist visit"]
    }
  ],
  "familyTrends": {
    "commonConditions": ["Diabetes", "Hypertension"],
    "medicationAdherence": "85%"
  }
}
```

---

## Admin Endpoints

Base path: `/api/admin`  
**Authentication:** ✅ Required (Admin role only)

### 1. Get All Users

**Endpoint:** `GET /api/admin/users`

**Success Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "type": "user",
      "isVerified": true,
      "createdAt": "2025-12-01T00:00:00Z"
    }
  ],
  "total": 150
}
```

---

### 2. Get Doctor Verifications

**Endpoint:** `GET /api/admin/doctor-verifications`

**Query Parameters:**
- `status`: Filter by status (`pending`, `approved`, `rejected`)

**Success Response:** `200 OK`
```json
{
  "verifications": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "507f1f77bcf86cd799439011",
      "userName": "Dr. Sarah Johnson",
      "email": "sarah@example.com",
      "documents": [
        "https://cloudinary.com/.../license.pdf",
        "https://cloudinary.com/.../id.pdf",
        "https://cloudinary.com/.../degree.pdf"
      ],
      "status": "pending",
      "submittedAt": "2026-01-08T10:00:00Z"
    }
  ]
}
```

---

### 3. Approve/Reject Doctor Verification

**Endpoint:** `PUT /api/admin/doctor-verifications/:id`

**Request Body:**
```json
{
  "status": "approved",
  "notes": "All documents verified successfully"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Doctor verification updated successfully",
  "verification": {
    "status": "approved",
    "reviewedAt": "2026-01-10T10:00:00Z"
  }
}
```

---

### 4. Get AI Usage Statistics

**Endpoint:** `GET /api/admin/ai-stats`

**Success Response:** `200 OK`
```json
{
  "totalConsultations": 1250,
  "totalTokensUsed": 450000,
  "averageTokensPerConsultation": 360,
  "estimatedCost": "$4.50",
  "consultationsByUrgency": {
    "Low": 500,
    "Medium": 600,
    "High": 150
  },
  "dateRange": {
    "from": "2025-12-01",
    "to": "2026-01-10"
  }
}
```

---

## Doctors and Appointments Endpoints

Base path: `/api/doctors` and `/api/appointments`  
**Authentication:** ✅ Required

### 1. Get All Doctors

**Endpoint:** `GET /api/doctors`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "doctors": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@hospital.com",
      "specialty": "Cardiology",
      "type": "doctor",
      "isVerified": true,
      "profile": {
        "qualifications": "MD, MBBS",
        "experience": "15 years",
        "languages": ["English", "Hindi"]
      },
      "availability": {
        "monday": ["09:00-12:00", "14:00-17:00"],
        "tuesday": ["09:00-12:00", "14:00-17:00"],
        "friday": ["09:00-13:00"]
      }
    }
  ]
}
```

---

### 2. Get Doctor Details

**Endpoint:** `GET /api/doctors/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@hospital.com",
  "specialty": "Cardiology",
  "profile": {
    "qualifications": "MD, MBBS",
    "experience": "15 years",
    "bio": "Specialized in preventive cardiology..."
  },
  "availability": {...},
  "rating": 4.8,
  "totalAppointments": 450
}
```

---

### 3. Update Doctor Availability

**Endpoint:** `PUT /api/doctors/availability`  
**Authentication:** ✅ Required (Doctor role)

**Request Body:**
```json
{
  "availability": {
    "monday": ["09:00-12:00", "14:00-17:00"],
    "tuesday": ["09:00-12:00"],
    "wednesday": ["14:00-18:00"],
    "thursday": ["09:00-12:00", "14:00-17:00"],
    "friday": ["09:00-13:00"]
  }
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Availability updated successfully",
  "availability": {...}
}
```

---

### 4. Get Doctor's Available Slots

**Endpoint:** `GET /api/doctors/:id/slots`  
**Authentication:** ✅ Required

**Query Parameters:**
- `date`: Date to check slots (YYYY-MM-DD)

**Example Request:**
```
GET /api/doctors/507f1f77bcf86cd799439011/slots?date=2026-01-15
```

**Success Response:** `200 OK`
```json
{
  "date": "2026-01-15",
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "14:00",
    "14:30"
  ]
}
```

---

### 5. Book Appointment

**Endpoint:** `POST /api/appointments`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "doctorId": "507f1f77bcf86cd799439011",
  "providerName": "Dr. Sarah Johnson",
  "specialty": "Cardiology",
  "appointmentDate": "2026-01-15T10:00:00Z",
  "notes": "Follow-up consultation for heart check-up"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439011",
    "providerName": "Dr. Sarah Johnson",
    "specialty": "Cardiology",
    "appointmentDate": "2026-01-15T10:00:00Z",
    "status": "scheduled",
    "createdAt": "2026-01-10T12:00:00Z"
  }
}
```

---

### 6. Get User Appointments

**Endpoint:** `GET /api/appointments`  
**Authentication:** ✅ Required

**Query Parameters:**
- `status`: Filter by status (scheduled, completed, cancelled)
- `upcoming`: Boolean (true/false) - only future appointments

**Success Response:** `200 OK`
```json
{
  "appointments": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "doctorId": "507f1f77bcf86cd799439011",
      "providerName": "Dr. Sarah Johnson",
      "specialty": "Cardiology",
      "appointmentDate": "2026-01-15T10:00:00Z",
      "status": "scheduled",
      "notes": "Follow-up consultation"
    }
  ]
}
```

---

### 7. Get Doctor's Appointments

**Endpoint:** `GET /api/appointments/doctor-appointments`  
**Authentication:** ✅ Required (Doctor role)

**Success Response:** `200 OK`
```json
{
  "appointments": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "appointmentDate": "2026-01-15T10:00:00Z",
      "status": "scheduled",
      "notes": "Follow-up consultation"
    }
  ]
}
```

---

### 8. Cancel Appointment

**Endpoint:** `DELETE /api/appointments/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "message": "Appointment cancelled successfully"
}
```

---

## Meeting Requests Endpoints

Base path: `/api/meetings`  
**Authentication:** ✅ Required

### 1. Request Meeting (Doctor → Admin)

**Endpoint:** `POST /api/meetings/request`  
**Authentication:** ✅ Required (Doctor role)

**Request Body:**
```json
{
  "topic": "New Treatment Protocol Discussion",
  "reason": "Need guidance on implementing new diabetes treatment guidelines",
  "urgency": "Urgent"
}
```

**Parameters:**
- `topic`: Required, meeting subject (10-200 chars)
- `reason`: Required, detailed explanation (50-1000 chars)
- `urgency`: Required, enum: "Normal", "Urgent", "Critical"

**Success Response:** `201 Created`
```json
{
  "message": "Meeting request submitted successfully",
  "request": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "requester": "507f1f77bcf86cd799439011",
    "topic": "New Treatment Protocol Discussion",
    "urgency": "Urgent",
    "status": "pending",
    "createdAt": "2026-01-10T12:00:00Z"
  }
}
```

---

### 2. Get Pending Meeting Requests

**Endpoint:** `GET /api/meetings/pending`  
**Authentication:** ✅ Required (Admin role)

**Success Response:** `200 OK`
```json
{
  "requests": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "requester": {
        "id": "507f1f77bcf86cd799439011",
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiology"
      },
      "topic": "New Treatment Protocol Discussion",
      "reason": "Need guidance on implementing new diabetes treatment guidelines",
      "urgency": "Urgent",
      "status": "pending",
      "createdAt": "2026-01-10T12:00:00Z"
    }
  ]
}
```

---

### 3. Approve and Schedule Meeting

**Endpoint:** `PUT /api/meetings/approve/:id`  
**Authentication:** ✅ Required (Admin role)

**Request Body:**
```json
{
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "scheduledAt": "2026-01-12T14:00:00Z",
  "duration": 60
}
```

**Parameters:**
- `meetingLink`: Required, Google Meet/Zoom URL
- `scheduledAt`: Required, meeting date/time (ISO 8601)
- `duration`: Optional, minutes (default: 60)

**Success Response:** `200 OK`
```json
{
  "message": "Meeting approved and scheduled",
  "meeting": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "status": "approved",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "scheduledAt": "2026-01-12T14:00:00Z",
    "duration": 60
  }
}
```

---

### 4. Get Upcoming Meetings

**Endpoint:** `GET /api/meetings/upcoming`  
**Authentication:** ✅ Required (Doctor role)

**Success Response:** `200 OK`
```json
{
  "meetings": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "topic": "New Treatment Protocol Discussion",
      "status": "approved",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "scheduledAt": "2026-01-12T14:00:00Z",
      "duration": 60
    }
  ]
}
```

---

### 5. Summarize Meeting Recording

**Endpoint:** `POST /api/meetings/summarize/:id`  
**Authentication:** ✅ Required (Admin role)  
**Content-Type:** multipart/form-data

**Request Body:**
```
recording: <Audio/Video file>
```

**Success Response:** `200 OK`
```json
{
  "message": "Meeting summarized successfully",
  "summary": "Meeting covered discussion on new diabetes treatment protocols. Key decisions: implement new guidelines starting next month, schedule follow-up training sessions.",
  "recordingLink": "https://drive.google.com/file/..."
}
```

---

## Consultation Reviews Endpoints

Base path: `/api/consultation`  
**Authentication:** ✅ Required

### 1. Request Doctor Review

**Endpoint:** `PUT /api/consultation/:id/request-review`  
**Authentication:** ✅ Required (User role)

**Request Body:**
```json
{
  "notes": "I would like a professional doctor to review this AI assessment"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Review request submitted successfully",
  "consultation": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "reviewStatus": "pending",
    "requestedAt": "2026-01-10T12:00:00Z"
  }
}
```

---

### 2. Get Consultation History

**Endpoint:** `GET /api/consultation/history`  
**Authentication:** ✅ Required

**Query Parameters:**
- `reviewStatus`: Filter by status (none, pending, reviewed)
- `limit`: Results per page (default: 20)

**Success Response:** `200 OK`
```json
{
  "consultations": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "symptoms": "Severe headache for 3 days",
      "aiSummary": "...",
      "urgency": "Medium",
      "reviewStatus": "reviewed",
      "doctorFeedback": "AI assessment is accurate. Monitor symptoms.",
      "reviewedBy": {
        "name": "Dr. Sarah Johnson",
        "specialty": "Neurology"
      },
      "reviewedAt": "2026-01-10T14:30:00Z",
      "createdAt": "2026-01-09T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Pending Reviews (Doctor Portal)

**Endpoint:** `GET /api/consultation/pending-reviews`  
**Authentication:** ✅ Required (Doctor role)

**Success Response:** `200 OK`
```json
{
  "consultations": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "userAge": 35,
      "symptoms": "Severe headache for 3 days with dizziness",
      "aiSummary": "Possible tension headaches or migraines...",
      "urgency": "Medium",
      "actions": [...],
      "requestedAt": "2026-01-09T10:00:00Z"
    }
  ]
}
```

---

### 4. Submit Professional Review

**Endpoint:** `PUT /api/consultation/:id/review`  
**Authentication:** ✅ Required (Doctor role)

**Request Body:**
```json
{
  "doctorFeedback": "The AI assessment is accurate. The symptoms suggest tension headaches. I recommend continuing with the suggested actions and monitoring symptoms for 48 hours.",
  "additionalRecommendations": [
    "If symptoms persist beyond 48 hours, schedule an in-person consultation",
    "Consider keeping a headache diary to track triggers",
    "Monitor blood pressure daily"
  ]
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Review submitted successfully",
  "consultation": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "reviewStatus": "reviewed",
    "reviewedBy": "507f1f77bcf86cd799439011",
    "reviewedAt": "2026-01-10T14:30:00Z"
  }
}
```

---

## Premium Subscriptions Endpoints

Base path: `/api/subscription`  
**Authentication:** ✅ Required

### 1. Create Checkout Session

**Endpoint:** `POST /api/subscription/create-checkout-session`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "priceId": "price_1234567890abcdef",
  "successUrl": "https://lifedoc.app/dashboard?success=true",
  "cancelUrl": "https://lifedoc.app/pricing"
}
```

**Parameters:**
- `priceId`: Required, Stripe price ID for the plan
- `successUrl`: Required, redirect URL on successful payment
- `cancelUrl`: Required, redirect URL on cancelled payment

**Success Response:** `200 OK`
```json
{
  "sessionId": "cs_test_1234567890abcdef",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890abcdef"
}
```

**Usage:**
```javascript
// Frontend code to redirect to Stripe Checkout
const response = await fetch('/api/subscription/create-checkout-session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    priceId: 'price_1234567890',
    successUrl: window.location.origin + '/dashboard?success=true',
    cancelUrl: window.location.origin + '/pricing'
  })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe Checkout
```

---

### 2. Get Subscription Status

**Endpoint:** `GET /api/subscription/status`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "hasActiveSubscription": true,
  "subscription": {
    "id": "sub_1234567890",
    "customerId": "cus_1234567890",
    "status": "active",
    "currentPeriodStart": "2026-01-10T00:00:00Z",
    "currentPeriodEnd": "2026-02-10T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "plan": {
      "name": "Premium Monthly",
      "amount": 999,
      "currency": "usd",
      "interval": "month"
    }
  },
  "recentPayments": [
    {
      "id": "pi_1234567890",
      "amount": 999,
      "status": "succeeded",
      "paymentDate": "2026-01-10T10:15:00Z",
      "invoiceUrl": "https://invoice.stripe.com/..."
    }
  ]
}
```

**No Active Subscription Response:** `200 OK`
```json
{
  "hasActiveSubscription": false,
  "subscription": null,
  "recentPayments": []
}
```

---

### 3. Stripe Webhook Handler

**Endpoint:** `POST /api/subscription/webhook`  
**Authentication:** ❌ Public (Stripe signature verified)

**Description:** This endpoint handles Stripe webhook events for subscription lifecycle management. It should be registered in your Stripe Dashboard.

**Webhook Events Handled:**
- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

**Webhook Configuration:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/subscription/webhook`
3. Select events: All subscription and invoice events
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## Saved Posts Endpoints

Base path: `/api/saved-posts`  
**Authentication:** ✅ Required

### 1. Save Article

**Endpoint:** `POST /api/saved-posts`  
**Authentication:** ✅ Required

**Request Body:**
```json
{
  "articleId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Article saved successfully",
  "savedPost": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "507f1f77bcf86cd799439011",
    "articleId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "savedAt": "2026-01-10T12:00:00Z"
  }
}
```

---

### 2. Unsave Article

**Endpoint:** `DELETE /api/saved-posts/:articleId`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "message": "Article unsaved successfully"
}
```

---

### 3. Get Saved Articles

**Endpoint:** `GET /api/saved-posts`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "savedPosts": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "article": {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "title": "New Diabetes Treatment Shows Promise",
        "summary": "...",
        "source": "Medical News Today",
        "publishedAt": "2026-01-09T08:00:00Z"
      },
      "savedAt": "2026-01-10T12:00:00Z"
    }
  ]
}
```

---

### 4. Get Saved Article IDs

**Endpoint:** `GET /api/saved-posts/ids`  
**Authentication:** ✅ Required

**Description:** Returns only the IDs of saved articles for quick lookup.

**Success Response:** `200 OK`
```json
{
  "articleIds": [
    "65a1b2c3d4e5f6g7h8i9j0k1",
    "65a1b2c3d4e5f6g7h8i9j0k2",
    "65a1b2c3d4e5f6g7h8i9j0k3"
  ]
}
```

---

## Doctor Endpoints

Base path: `/api/doctor`  
**Authentication:** ✅ Required (Doctor role)

### 1. Get Pending Consultations

**Endpoint:** `GET /api/doctor/consultations/pending`

**Success Response:** `200 OK`
```json
{
  "consultations": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "symptoms": "Severe headache for 3 days",
      "aiSummary": "...",
      "urgency": "Medium",
      "date": "2026-01-09T10:00:00Z"
    }
  ]
}
```

---

### 2. Review Consultation

**Endpoint:** `POST /api/doctor/consultations/:id/review`

**Request Body:**
```json
{
  "feedback": "AI assessment is accurate. Patient should monitor symptoms and follow up if they persist.",
  "recommendations": ["Schedule appointment if symptoms worsen", "Try relaxation techniques"],
  "status": "reviewed"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Consultation reviewed successfully"
}
```

---

## Medicine Reference Endpoints

Base path: `/api/reference`

### 1. Search Medicines

**Endpoint:** `GET /api/reference/medicines/search`  
**Authentication:** ✅ Required

**Query Parameters:**
- `q`: Search query (medicine name)
- `limit`: Results limit (default: 10, max: 50)

**Example Request:**
```
GET /api/reference/medicines/search?q=metformin&limit=10
```

**Success Response:** `200 OK`
```json
{
  "medicines": [
    {
      "name": "Metformin Hydrochloride",
      "brandNames": ["Glucophage", "Fortamet"],
      "genericName": "Metformin",
      "dosageForms": ["Tablet", "Extended Release"],
      "manufacturer": "Various",
      "fdaUrl": "https://..."
    }
  ]
}
```

---

### 2. Get Medicine Details

**Endpoint:** `GET /api/reference/medicines/:id`  
**Authentication:** ✅ Required

**Success Response:** `200 OK`
```json
{
  "name": "Metformin Hydrochloride",
  "genericName": "Metformin",
  "brandNames": ["Glucophage", "Fortamet"],
  "indications": ["Type 2 Diabetes Mellitus"],
  "dosage": "500mg to 2000mg daily",
  "sideEffects": ["Nausea", "Diarrhea", "Stomach upset"],
  "warnings": ["Risk of lactic acidosis", "Kidney function monitoring required"],
  "interactions": ["Alcohol", "Contrast dyes"],
  "manufacturer": "Various",
  "fdaApprovalDate": "1994-12-29"
}
```

---

## News Endpoints

Base path: `/api/news`

### 1. Get Health News

**Endpoint:** `GET /api/news`  
**Authentication:** ✅ Required

**Query Parameters:**
- `category`: Filter by category (e.g., `diabetes`, `cardiology`)
- `limit`: Results per page (default: 20)

**Success Response:** `200 OK`
```json
{
  "articles": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "New Diabetes Treatment Shows Promise",
      "summary": "Researchers have discovered...",
      "source": "Medical News Today",
      "url": "https://...",
      "imageUrl": "https://...",
      "publishedAt": "2026-01-09T08:00:00Z",
      "category": "diabetes"
    }
  ]
}
```

---

## Webhooks (Coming Soon)

Receive real-time notifications for critical events.

**Supported Events:**
- `measurement.critical` - Vital signs exceed danger thresholds
- `consultation.high_urgency` - High-urgency AI consultation created
- `family.member_added` - New member joined family
- `report.analyzed` - Lab report analysis completed

**Webhook Payload Example:**
```json
{
  "event": "measurement.critical",
  "timestamp": "2026-01-10T12:00:00Z",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "measurementType": "blood_pressure",
    "value": { "systolic": 180, "diastolic": 110 },
    "severity": "critical"
  }
}
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript

```bash
npm install @lifedoc/api-client
```

```typescript
import { LifeDocClient } from '@lifedoc/api-client';

const client = new LifeDocClient({
  apiKey: 'your_jwt_token',
  baseURL: 'https://api.lifedoc.app'
});

// Example: Get measurements
const measurements = await client.measurements.list({
  type: 'blood_pressure',
  limit: 10
});
```

---

## Testing with Postman

Import our Postman collection for easy API testing:

**Collection URL:** `https://www.postman.com/lifedoc/collection`

**Environment Variables:**
```
base_url: http://localhost:5000/api
token: <your_jwt_token>
```

---

## API Changelog

### Version 1.0 (Current)
- Initial API release
- All core endpoints operational
- JWT authentication implemented
- Rate limiting active

### Upcoming (Version 1.1)
- GraphQL endpoint
- WebSocket for real-time updates
- Batch operations
- Enhanced filtering and sorting

---

## Support & Feedback

- **API Issues**: [GitHub Issues](https://github.com/your-username/lifedoc/issues)
- **Email**: api-support@lifedoc.app
- **Documentation**: [Main README](README.md)

---

