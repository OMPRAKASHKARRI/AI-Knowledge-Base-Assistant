# Debug Notes

## Issue 1 – AI Integration

### Problem

The initial AI integration using Gemini produced quota-related and model availability errors during testing.

### Root Cause

The configured Gemini model was unavailable or exceeded API limits.

### Investigation

API logs and error responses indicated model availability and quota restrictions.

### Solution

The AI integration was migrated to the Groq API using a supported production model. Environment variables and AI service configuration were updated accordingly.

---

## Issue 2 – JWT Authentication

### Problem

Protected API endpoints returned unauthorized responses even after successful login.

### Root Cause

The JWT token was not consistently included in authenticated requests.

### Investigation

HTTP requests and authentication middleware were inspected to verify Authorization headers.

### Solution

The frontend Axios client was updated to include the JWT token for all protected API requests.

---

## Issue 3 – File Upload Validation

### Problem

Users could attempt to upload unsupported file types.

### Root Cause

Validation was only partially implemented.

### Investigation

Multiple file formats were tested to identify unsupported uploads.

### Solution

Server-side validation was added to accept only PDF, TXT, and Markdown files. Appropriate error messages were returned for invalid uploads.

---

## Issue 4 – TypeScript Configuration

### Problem

Visual Studio Code displayed a deprecation warning related to the TypeScript configuration.

### Root Cause

The project used a deprecated compiler option that will be removed in future TypeScript versions.

### Investigation

The TypeScript compiler documentation was reviewed.

### Solution

The configuration was updated by adding the recommended deprecation compatibility setting while maintaining compatibility with existing project imports.