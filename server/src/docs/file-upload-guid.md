# File Upload Guide

## Overview

This guide outlines the step-by-step process for uploading a user profile picture in the BlogSite application, including validation, processing, and storage.

## Step-by-Step Process

1. **Frontend File Selection** :

* User navigates to the Update Profile page (`/profile/update`).
* User selects an image file (JPG, PNG, or WEBP) using the file input field.
* A preview of the selected image is displayed using `URL.createObjectURL`.

1. **Frontend Submission** :

* User submits the form, which includes username, email, optional password, and the selected profile picture.
* The form data is sent as a `FormData` object to the backend via a PUT request to `/api/users/profile`.
* A loading spinner is displayed during the upload process.

1. **Backend Validation** :

* The `multer` middleware processes the incoming file, enforcing:
  * File size limit: 2MB.
  * File type: Only JPG, PNG, or WEBP allowed.
* If validation fails, an error is returned (e.g., "File type not supported" or "File size exceeds 2MB").

1. **Image Processing** :

* The `sharp` library resizes the image to 256x256 pixels with a "fill" crop and center position.
* The processed image buffer is prepared for upload to Cloudinary.

1. **Cloudinary Upload** :

* The image buffer is uploaded to Cloudinary using the `uploadToCloudinary` utility.
* Cloudinary applies automatic quality optimization and format conversion (e.g., to WEBP).
* If the user had a previous profile picture, its `public_id` is used to delete the old image from Cloudinary.

1. **Database Update** :

* The Cloudinary `secure_url` and `public_id` are saved to the user's `profilePicture` and `profilePicturePublicId` fields in the MongoDB `User` document.
* Other fields (username, email, password) are updated if provided.

1. **Response and UI Update** :

* The backend returns the updated user object with the new profile picture URL.
* The frontend updates the UI to display the new profile picture in the navbar, comments, posts, and user profile page.
* The loading spinner is hidden, and the user is redirected to their profile page.

## Screenshots

*(Note: Screenshots would be added here in a real-world scenario. For this implementation, imagine:)*

* Screenshot 1: Update Profile page with file input and image preview.
* Screenshot 2: Loading spinner during upload.
* Screenshot 3: Updated profile picture displayed in the navbar and profile page.
