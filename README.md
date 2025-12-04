(Node.js + Express + MySQL + React + Docker)

This repository contains a full-stack CRUD application with:

Backend: Node.js + Express (inside /crud)

Frontend: React (inside /Frontend)

Database: MySQL (Docker)

Containerization: Docker & Docker Compose

All services run together using a single docker-compose.yml.

project-root/
│
├── crud/                     # Backend service (Node.js + Express)
│   ├── db/
│   ├── handlers/
│   ├── middleware/
│   ├── routes/
│   ├── node_modules/
│   ├── .env                  # Backend environment file (YOU create this)
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── docker-compose.yml        # Multi-service Docker setup
└── guide.txt


⚙️ Setting Up the Backend Environment (.env)

Create a file named .env inside the crud/ folder:
  crud/.env


Paste the following:

# Port on which the backend server will run
PORT=5000

# Hostname of the MySQL service as defined in docker-compose
# Do NOT use "localhost" when using Docker — use the service name instead.
MYSQL_HOST=mysql

# Port inside the MySQL Docker container
MYSQL_PORT=3306

# MySQL credentials (set your own username/password)
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here

# Name of the database to be created/used
MYSQL_DATABASE_NAME=your_database_name_here

# JWT configuration (used for authentication)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h   # Token expiration time


🚀 Running the Project (with Docker)

From the root folder of the project, run:
  docker compose up --build


▶️ Running the Frontend

To start the React application in development mode, navigate to the Frontend directory and run: 
  npm run dev

This launches the Vite development server and makes the frontend available at: http://localhost:5173
