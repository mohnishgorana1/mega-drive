# ☁️ MDrive - Native Cloud Storage SaaS

![MDrive Banner](./public/assets/dashboard%20snap.png) 

MDrive is a full-stack, production-ready cloud storage application engineered to replicate the seamless experience of a native operating system in the browser. It features real-time storage tracking, deeply nested folder architecture, secure public sharing, and robust file management capabilities.

**[🌍 Live Demo](https://mdrive-mg.vercel.app/)** | **[💻 Watch the Journey](https://www.linkedin.com/posts/mohnish-gorana_buildingabrmdrive-productlaunch-saas-ugcPost-7439617144012562432-zn8r?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFV7uoQB9Mrd3K7ECZ3MO1MhAd58HUZKVfg)**

---

## ✨ Core Features

* **Direct-to-Cloud Uploads:** Bypasses standard serverless payload limits (like Vercel's 4.5MB cap) by uploading directly from the client to Cloudinary, enabling massive file uploads with a 100% accurate real-time progress bar.
* **Advanced File System Logic:** Full support for `Cut`, `Copy`, and `Paste` operations for files and nested folders. Includes strict algorithmic checks (`isDestInsideSource`) to prevent infinite recursion crashes.
* **Deep Cloud Copying:** Integrated with Cloudinary SDK to perform true "Deep Copies" of assets, ensuring duplicated files don't break when the original is deleted.
* **Secure Public Sharing:** Generate dynamic, unguessable URL tokens using the Edge-compatible Web Crypto API. Includes a public/private toggle with instant visual indicators (Globe badge).
* **Bulk Operations & Global Search:** Select multiple items, bulk-delete, and bulk-move. Features a globally debounced custom search API to prevent server choking ("Thundering Herd" problem).
* **Cloud Pulse (Storage Tracker):** Real-time capacity monitoring dashboard that updates dynamically upon uploads and deletions.
* **Sleek UI/UX:** Built with Tailwind CSS and Framer Motion, featuring a dedicated Landing Page, Apple-style Floating Action Bars, Context Menus, and Toast notifications.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, React Hot Toast
* **Backend:** Next.js Serverless Route Handlers
* **Database:** MongoDB with Mongoose
* **Authentication:** Clerk (with Webhook sync)
* **Storage Provider:** Cloudinary (Signed & Unsigned Presets)

---

## 🧠 Engineering Highlights (Challenges Solved)

### 1. The Serverless Payload Limit
* **Problem:** Next.js API routes on Vercel choke on files larger than 4.5MB.
* **Solution:** Engineered a direct client-to-cloud upload architecture using Cloudinary's Unsigned Presets, communicating with the Next.js server only post-upload to save database records.

### 2. The Infinite Recursion Loop
* **Problem:** A user copying "Folder A" and pasting it *inside* "Folder A" would crash the server via infinite recursion.
* **Solution:** Built a recursive tree-checking algorithm (`isDestInsideSource`) to block cyclic pasting operations instantly.

### 3. MongoDB E11000 Null Trap
* **Problem:** Revoking access from a shared file by setting `shareToken: null` triggered a Duplicate Key Error on MongoDB's unique sparse index.
* **Solution:** Re-engineered the database update logic to use the `$unset` operator, fully stripping the field instead of assigning an empty value.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed and accounts set up on [MongoDB](https://www.mongodb.com/), [Clerk](https://clerk.com/), and [Cloudinary](https://cloudinary.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/mdrive.git](https://github.com/yourusername/mdrive.git)
   cd mdrive
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the following keys:

    ```env
    # Authentication (Clerk)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # Database (MongoDB)
    MONGODB_URI=your_mongodb_connection_string

    # Storage (Cloudinary)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=your_unsigned_preset_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 🤝 Contributing

Contributions, issues, and feature requests are welcome\! Feel free to check the issues page.

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.


