# Cloud Integration Manual

## Overview

The BlogSite application integrates with Cloudinary for storing and managing user profile pictures. This manual explains the setup, configuration, and usage of Cloudinary in the backend.

## Cloudinary Setup

1. **Account Creation** :

* Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/).
* Obtain the `cloud_name`, `api_key`, and `api_secret` from the Cloudinary dashboard.

1. **Environment Configuration** :

* Add the following to the `.env` file in the server directory:
  ```
  CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
  CLOUDINARY_API_KEY=your-cloudinary-api-key
  CLOUDINARY_API_SECRET=your-cloudinary-api-secret
  ```
* The `dotenv` package loads these credentials into `process.env`.

1. **Cloudinary Configuration** :

* The `cloudinary` package is configured in `src/utils/cloudinary.js` using the credentials from the `.env` file.
* Configuration includes:
  * `cloud_name`, `api_key`, and `api_secret` for authentication.
  * Default folder: `blogsite/profiles` for organizing profile pictures.

## Usage in Application

1. **Upload Process** :

* The `uploadToCloudinary` utility (`src/utils/cloudinary.js`) handles image uploads.
* Parameters:
  * `buffer`: The image buffer processed by `sharp`.
  * `folder`: Specifies the Cloudinary folder (`blogsite/profiles`).
* Transformations:
  * Resize to 256x256 pixels with `fill` crop and `face` gravity.
  * Automatic quality optimization (`quality: auto`).
  * Automatic format conversion (`fetch_format: auto`).
* Returns: `secure_url` (image URL) and `public_id` (Cloudinary identifier).

1. **Deletion Process** :

* The `deleteFromCloudinary` utility deletes old profile pictures using the `public_id` when a new image is uploaded.
* Ensures storage efficiency by removing outdated images.

1. **Integration in Controller** :

* The `updateUser` controller (`src/controllers/user.controller.js`) uses `multer` to handle file uploads and `sharp` to process images.
* The processed image is uploaded to Cloudinary, and the resulting URL and `public_id` are saved to the `User` model.

## Error Handling

* **Cloudinary Errors** : Caught and returned as HTTP 400 responses with messages like "Cloudinary upload failed".
* **File Validation Errors** : Handled by `multer` (e.g., "File type not supported" or "File size exceeds 2MB").
* **Database Errors** : MongoDB errors during user document updates are returned as HTTP 400 responses.

## Testing

* Test the upload route (`PUT /api/users/profile`) with valid (JPG, PNG, WEBP) and invalid (e.g., PDF) files.
* Verify the `profilePicture` and `profilePicturePublicId` fields in the MongoDB `User` document.
* Confirm old images are deleted from Cloudinary when a new image is uploaded.
