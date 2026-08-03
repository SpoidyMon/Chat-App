# Codebase Bug & Vulnerability Report

This file documents the critical bugs, security vulnerabilities, performance issues, and missing feature integrations identified in the **Chat App** codebase.

---

## 1. ⚠️ Security Vulnerability: Cookie Option Key Typos (High Severity)
* **Location:** `Backend/src/lib/utils.js` (lines 10–11)
* **Code snippet:**
  ```javascript
  res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      Httponly: true,      // ❌ Typo
      samSite: "strict",   // ❌ Typo
      secure: process.env.NODE_ENV !== "development",
  })
  ```
* **Description:** Express cookie configuration expects options to be exact camelCase names. 
  - `Httponly` must be **`httpOnly`**.
  - `samSite` must be **`sameSite`**.
* **Impact:** 
  1. The browser will issue the cookie **without** the `httpOnly` flag. If the app has an XSS (Cross-Site Scripting) vulnerability, attackers can steal the JWT cookie via `document.cookie` in javascript.
  2. The browser ignores the invalid `samSite` option, disabling CSRF (Cross-Site Request Forgery) protection for cross-domain requests.

---

## 2. 🐛 Frontend Bug: Login Loading State Spelling Mismatch
* **Locations:**
  - `Frontend/src/Pages/LoginPage.jsx` (line 15)
  - `Frontend/src/Store/UseAuthStore.js` (line 10 & 56)
* **Code snippet:**
  - **LoginPage.jsx:**
    ```javascript
    const { login, isLoggingIn } = useAuthStore();
    ```
  - **UseAuthStore.js:**
    ```javascript
    isLogginIn: false,
    ```
* **Description:** There is a spelling mismatch between the state property defined in the Zustand store (`isLogginIn` with two "g"s) and the variable destructured in the Login Page component (`isLoggingIn` with one "g").
* **Impact:** The variable `isLoggingIn` evaluates to `undefined` in the LoginPage. When logging in, the button stays enabled and the spinner/loader never displays, allowing users to submit multiple login requests at the same time.

---

## 3. 💾 Performance/Database Issue: Storing Raw Base64 Images directly in MongoDB
* **Location:** `Backend/src/controllers/auth.contoller.js` (lines 99–124)
* **Description:** The `updateController` imports `cloudinary` but does not use it. Instead, it updates the user profile directly using the raw base64 data URL payload from the frontend:
  ```javascript
  const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic }, // ❌ Storing raw base64 string
      { new: true }
  );
  ```
* **Impact:** Storing large base64 strings directly in MongoDB is highly inefficient. It bloats database documents, degrades query times, and risks hitting MongoDB's strict **16MB document size limit**. The handler should upload the base64 image to Cloudinary first and store the resulting image URL instead.

---

## 4. 🎨 UI Bug: Uncompiled DaisyUI 5 Themes
* **Locations:**
  - `Frontend/src/index.css` (line 4)
  - `Frontend/src/constants/index.js`
  - `Frontend/src/Store/UseThemeStore.js`
* **Description:** 
  - The `UseThemeStore.js` sets the default theme to `"coffee"`. 
  - `constants/index.js` lists 32 available themes.
  - However, `index.css` restricts the DaisyUI 5 compilation to only four themes:
    ```css
    @plugin "daisyui" {
        themes: light --default, dark, cupcake, retro;
    }
    ```
* **Impact:** If a user selects any theme other than `light`, `dark`, `cupcake`, or `retro` (including the default `"coffee"` theme), the browser won't be able to apply the theme styles because DaisyUI 5 does not compile/bundle them. The app will fall back to basic unthemed colors.

---

## 5. 🔌 Missing Integration: Non-Functional Online Status & Real-Time Chat
* **Locations:**
  - `Frontend/src/Components/ChatHeader.jsx`
  - `Frontend/src/Components/Sidebar.jsx`
* **Description:** The UI references `onlineUsers` from the `useAuthStore` to indicate if a user is "Online" or "Offline" and display online user counts.
* **Impact:** Since Socket.io is not wired up on either the client or server, the `onlineUsers` array remains permanently empty `[]`. As a result, all users constantly show as **Offline**, and messages sent by other users will never appear on the screen in real-time unless the user manually refreshes the page or re-selects the conversation.
