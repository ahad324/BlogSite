# Error Handling Documentation

## Overview

This document outlines possible errors related to profile picture uploads in the BlogSite application, their causes, and how they are handled and communicated to the frontend.

## Possible Issues and Responses

1. **File Missing** :

* **Cause** : No file is selected in the profile picture input.
* **Backend Response** : HTTP 400 - "File type not supported. Please upload JPG, PNG, or WEBP." (handled by `multer`).
* **Frontend Handling** : Displays error message in the UI (e.g., "Please select an image file").

1. **Invalid File Type** :

* **Cause** : Uploaded file is not JPG, PNG, or WEBP.
* **Backend Response** : HTTP 400 - "File type not supported. Please upload JPG, PNG, or WEBP."
* **Frontend Handling** : Shows error message below the file input (e.g., "Invalid file type. Use JPG, PNG, or WEBP").

1. **File Size Exceeds Limit** :

* **Cause** : Uploaded file is larger than 2MB.
* **Backend Response** : HTTP 400 - "File size exceeds 2MB."
* **Frontend Handling** : Displays error message in the UI (e.g., "File is too large. Maximum size is 2MB").

1. **Cloudinary Upload Failure** :

* **Cause** : Network issues, invalid credentials, or Cloudinary service errors.
* **Backend Response** : HTTP 400 - "Cloudinary upload failed: [error message]".
* **Frontend Handling** : Shows error message in the UI (e.g., "Failed to upload image. Please try again").

1. **Database Update Failure** :

* **Cause** : MongoDB errors during user document update (e.g., duplicate username/email).
* **Backend Response** : HTTP 400 - "[MongoDB error message]" or "Failed to update profile".
* **Frontend Handling** : Displays error message in the UI (e.g., "Failed to update profile. Username already taken").

1. **Authentication Failure** :

* **Cause** : Missing or invalid JWT token.
* **Backend Response** : HTTP 401 - "Authentication token missing" or "Invalid or expired token".
* **Frontend Handling** : Redirects to login page with an error message.

## Error Handling Mechanisms

* **Backend** :
* `multer` validates file type and size before processing.
* `sharp` ensures consistent image resizing to prevent processing errors.
* `cloudinary` errors are caught in the `uploadToCloudinary` utility and returned as HTTP responses.
* `errorMiddleware` catches all unhandled errors and returns formatted JSON responses.
* **Frontend** :
* Error messages are displayed in the UI using state (`error`) in the `UpdateProfile` component.
* A loading spinner (`LoadingSpinner`) is shown during upload to indicate progress.
* Errors are cleared upon successful submission or page refresh.
