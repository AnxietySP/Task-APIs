# Task List REST API

A light, flexible RESTful API built with **Node.js**, **Express**, and **Aiven MySQL Cloud Database**. This API provides complete CRUD (Create, Read, Update, Delete) operations for managing tasks.

## 🚀 Features

- **Full CRUD Support**: Manage tasks seamlessly using standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Cloud Database Integration**: Connected to a managed Aiven Cloud MySQL instance using `mysql2/promise` with SSL encryption.
- **Environment Security**: Uses `dotenv` for managing sensitive credentials securely outside version control.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Aiven Cloud MySQL
- **Driver**: `mysql2` (Promise-based)
- **Environment Management**: `dotenv`

---

## 📁 Project Structure

```text
Task_APIs/
├── src/
│   └── db.js          # Database connection configuration (MySQL Pool)
├── .env               # Environment variables (Ignored by Git)
├── .gitignore         # Prevents committing secrets and dependencies
├── package.json       # Project dependencies & scripts
├── README.md          # Project documentation
└── server.js          # Express app server and API endpoints
