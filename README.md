Rich Text Editor Project

A full-featured rich text editor built with React, ReactQuill, Node.js, and MySQL, supporting image uploads, CRUD operations, and read-only viewing.
This project demonstrates a CMS-style system with Delta-based content storage and a modern editor interface.

Features

Rich Text Formatting: Bold, Italic, Underline, Strikethrough, Headers, Lists, Blockquotes, Code blocks

Media Support: Images, Links, Videos

Delta-based Storage: JSON content stored in MySQL for reliable and structured storage

Full CRUD Functionality:

List all documents

Edit documents

Delete documents

Read-Only Viewer: Safe rendering of content for preview

Theme Switching: Snow (default) and Bubble

Extensible Architecture: Custom toolbar and modules

Tech Stack
Layer	Technology
Frontend	React, ReactQuill, Axios, Vite
Backend	Node.js, Express, Multer, MySQL2
Database	MySQL
Storage	Server-side /uploads folder
Optional UI	TailwindCSS or Material UI
Project Structure
Textarea_Project/
│
├─ backend/
│  ├─ db.js           # MySQL connection
│  ├─ routes.js       # API routes (CRUD + image upload)
│  ├─ server.js       # Express server
│  └─ uploads/        # Uploaded images
│
└─ frontend/
   ├─ src/
   │  ├─ App.jsx         # Main layout
   │  ├─ Editor.jsx      # Rich text editor
   │  ├─ DocumentList.jsx# Document list & edit
   │  ├─ Viewer.jsx      # Read-only viewer
   │  └─ main.jsx        # App bootstrap
   └─ package.json
