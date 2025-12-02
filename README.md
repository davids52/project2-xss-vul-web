# CSP & XSS Demo Project

## Description
This web application is designed to demonstrate how **Content Security Policy (CSP)** can restrict **Cross-Site Scripting (XSS)** attacks.

The application includes the following features:
- **View Posts**: Display a list of posts.
- **View Comments**: Show comments associated with each post.
- **Add Comments**: Allow users to submit new comments.

## Vulnerabilities
The application simulates two types of XSS vulnerabilities for educational purposes:
1.  **Reflected XSS**: Occurs in the `name` input field on the `/index` route.
2.  **Stored XSS**: Occurs when rendering/displaying user comments.

---

## Installation & Setup

### 1. Install Dependencies
Run command `pip install -r requirements.txt`

### 2. Initilize Database
Run command respectly: `flask init-db`, `flask init-data`

### 3. Run app
Run command `flask --app app run`
