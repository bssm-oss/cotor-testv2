# Goal Management API Documentation

## Overview
This API provides endpoints for managing goals in the Cotor Organization system.

## Base URL
`http://localhost:3000/api`

## Endpoints

### Get All Goals
- **URL**: `/goals`
- **Method**: `GET`
- **Description**: Retrieve all goals
- **Response**: 
  - Status: 200 OK
  - Body: Array of goal objects

### Get Goal by ID
- **URL**: `/goals/:id`
- **Method**: `GET`
- **Description**: Retrieve a specific goal by its ID
- **Parameters**: 
  - `id` (integer): Goal ID
- **Response**: 
  - Status: 200 OK (if found)
  - Body: Goal object
  - Status: 404 Not Found (if goal doesn't exist)

### Create Goal
- **URL**: `/goals`
- **Method**: `POST`
- **Description**: Create a new goal
- **Request Body**:
  ```json
  {
    "title": "string (required, max 100 characters)",
    "description": "string (optional, max 500 characters)",
    "priority": "string (required, one of: low, medium, high)",
    "targetDate": "string (optional, ISO date format)"
  }
  ```
- **Validation Rules**:
  - Title is required and must be a string between 1-100 characters
  - Description is optional but if provided must be a string max 500 characters
  - Priority is required and must be one of: 'low', 'medium', 'high'
  - TargetDate is optional but if provided must be a valid date string
- **Response**:
  - Status: 201 Created (if successful)
  - Body: Created goal object
  - Status: 400 Bad Request (if validation fails)
    ```json
    {
      "error": "Validation failed",
      "details": ["Array of validation error messages"]
    }
    ```

### Update Goal
- **URL**: `/goals/:id`
- **Method**: `PUT`
- **Description**: Update an existing goal
- **Parameters**: 
  - `id` (integer): Goal ID
- **Request Body**: Same as Create Goal
- **Validation Rules**: Same as Create Goal
- **Response**:
  - Status: 200 OK (if successful)
  - Body: Updated goal object
  - Status: 400 Bad Request (if validation fails)
  - Status: 404 Not Found (if goal doesn't exist)

### Delete Goal
- **URL**: `/goals/:id`
- **Method**: `DELETE`
- **Description**: Delete a goal
- **Parameters**: 
  - `id` (integer): Goal ID
- **Response**:
  - Status: 204 No Content (if successful)
  - Status: 404 Not Found (if goal doesn't exist)

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message",
  "details": ["Additional error details"] // Optional
}
```

## Data Model
A goal object has the following properties:
- `id` (integer): Unique identifier
- `title` (string): Goal title
- `description` (string, optional): Goal description
- `priority` (string): Priority level (low, medium, high)
- `targetDate` (string, optional): Target completion date (ISO format)
- `createdAt` (string): Creation timestamp (ISO format)
- `updatedAt` (string, optional): Last update timestamp (ISO format)