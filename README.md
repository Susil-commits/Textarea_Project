# 📝 DocManager - Rich Text Document System

**DocManager** is a modern, full-stack web application designed for creating, managing, and viewing rich text documents. It features a powerful WYSIWYG editor capable of handling text formatting and direct file/image uploads, backed by a robust MySQL database.

---

## ✨ Features

- **Rich Text Editing**: Create beautiful documents using a React-Quill-New based editor (Bold, Italic, Lists, Links, etc.).
- **File & Image Uploads**: Seamlessly upload images and files directly within the document content.
- **Document Management**: Save, list, and retrieve documents with ease.
- **Read-Only Mode**: View saved documents in a clean, read-only viewer.
- **Modern UI**: Polished, responsive interface built with **Tailwind CSS v4**.
- **Auto-Database Setup**: The application automatically initializes the MySQL database and tables on startup.
- **Unified Workflow**: Run both backend and frontend with a single command.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18**: Component-based UI library.
- **Vite**: Next-generation frontend tooling for fast builds.
- **Tailwind CSS v4**: Utility-first CSS framework for modern styling.
- **React Quill**: Rich text editor component.
- **Axios**: HTTP client for API requests.

### **Backend**
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated web framework.
- **MySQL2**: High-performance MySQL client.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js** (v14+ recommended)
2.  **MySQL Server** (Running locally)
    *   *Default Config*: User: `root`, Password: `Susil@2004` (You can change this in `backend/db.js`)

---

## 📥 Installation & Setup

1.  **Clone the Repository** (if applicable) or navigate to the project folder.

2.  **Install Dependencies**
    Run the following command in the **root** directory to install dependencies for both frontend and backend:
    ```bash
    npm install
    npm run install:all
    ```
    *(Note: `npm run install:all` is a custom script defined in package.json to install sub-project dependencies)*

3.  **Configure Database**
    Ensure your MySQL server is running. The application will automatically create the database `quill_db` and necessary tables upon connection.
    *   *Optional*: If you need to change database credentials, edit `backend/db.js`.

4.  **Start the Application**
    Launch both the Backend API and Frontend App simultaneously:
    ```bash
    npm start
    ```

    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 🗄️ Database Schema

The project uses a simple relational schema:

### `documents`
| Column       | Type       | Description                  |
| :----------- | :--------- | :--------------------------- |
| `id`         | INT (PK)   | Unique Document ID           |
| `title`      | VARCHAR    | Title of the document        |
| `content`    | LONGTEXT   | JSON-formatted Quill Delta   |
| `created_at` | TIMESTAMP  | Date of creation             |

### `uploaded_files`
| Column          | Type       | Description                  |
| :-------------- | :--------- | :--------------------------- |
| `id`            | INT (PK)   | Unique File ID               |
| `filename`      | VARCHAR    | System filename (unique)     |
| `original_name` | VARCHAR    | Original upload name         |
| `file_type`     | VARCHAR    | MIME type (e.g., image/png)  |
| `file_url`      | VARCHAR    | Accessible URL               |
| `uploaded_at`   | TIMESTAMP  | Date of upload               |

---

## 📂 Project Structure

```
Textarea_Project/
├── backend/               # Express API Server
│   ├── uploads/           # Stored uploaded files
│   ├── db.js              # Database connection & init
│   ├── routes.js          # API Routes
│   └── server.js          # Entry point
│
├── frontend/              # React Vite App
│   ├── src/
│   │   ├── App.jsx        # Main Layout
│   │   ├── Editor.jsx     # Rich Text Editor Component
│   │   ├── Viewer.jsx     # Read-Only Document Viewer
│   │   └── DocumentList.jsx # Sidebar List
│   └── vite.config.js     # Vite Configuration
│
├── package.json           # Root scripts (npm start)
└── README.md              # Project Documentation
```

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
