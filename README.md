# Task List REST API (MVC + MySQL)

A robust, full-stack Task Management application built with **Node.js**, **Express**, **MVC Architecture**, and an **Aiven Cloud MySQL Database**, complete with a responsive vanilla JavaScript frontend.

## 🚀 Features

- **Model-View-Controller (MVC)**: Clean separation of concerns with modularized `models`, `controllers`, and `routes`.
- **Full CRUD Support**: Create, read, update, and delete tasks seamlessly using standard HTTP methods.
- **Cloud Database Integration**: Connected to an Aiven Cloud MySQL instance using `mysql2/promise` with automatic seeding via `schema.sql`.
- **Interactive Frontend**: A responsive, clean user interface served via `public/` supporting real-time task status updates and filtering.
- **CORS & Environment Security**: Configured with `cors` middleware and `dotenv` for secure credential management.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Aiven Cloud MySQL (`mysql2/promise`)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Middleware**: `cors`, `dotenv`

---

## 📁 Project Structure

```text
Task_APIs/
├── database/
│   └── schema.sql       # Database table creation and initial seeding
├── public/
│   ├── index.html       # Frontend user interface
│   ├── script.js        # Frontend logic and API fetch requests
│   └── style.css        # Application styling
├── src/
│   ├── controllers/
│   │   └── taskController.js # Request handlers and business logic
│   ├── models/
│   │   └── taskModel.js      # Database queries and data operations
│   ├── routes/
│   │   └── taskRoutes.js     # API endpoint routing
│   └── db.js                 # MySQL connection pool configuration
├── .env                 # Environment variables (Ignored by Git)
├── .env.example         # Environment variables template
├── .gitignore           # Prevents committing secrets and dependencies
├── package.json         # Project dependencies & scripts
├── README.md            # Project documentation
├── server.js            # Express app entry point and server setup
└── test-db.js           # Database connectivity test utility
