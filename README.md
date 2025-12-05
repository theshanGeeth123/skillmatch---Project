SkillFusion - is a streamlined system for managing personnel, skills and projects with automated matching to identify the best-fit team members based on required skills.

Tech Stack: Node.js + Express + MySQL + React + Docker

Prerequisites: Node.js version = v22.16.0 , MySQL version = mysql:latest (This project runs using Docker, and the MySQL service uses the latest official MySQL Docker image (`mysql:latest`) )

Step-by-step setup instructions:

  1) How to clone the repository: In your project folder cmd run -> git clone https://github.com/theshanGeeth123/skillmatch---Project.git
  2) How to install dependencies: Go to frontend folder and open with "open with integrated terminal " option and run -> npm install
                                   Go to project main folder and run in cmd -> docker compose up --build (Run this after setup the environment variables)
  3) How to set up the database (create database, run schema): Dont need to run sql commands separately, All essential database and tables created when run the project via                                         docker
  4) How to configure environment variables:

      PORT=5000 // Port on which the backend server will run

      MYSQL_HOST=mysql

      MYSQL_PORT=3306

      MYSQL_USER=root
      MYSQL_PASSWORD=your_mysql_password_here
      
      MYSQL_DATABASE_NAME=your_database_name_here
 
      JWT_SECRET=your_jwt_secret_key_here
      JWT_EXPIRES_IN=1h  

  6) How to run the frontend : Go to frontend folder and open with "open with integrated terminal " option and run -> npm run dev
  7) How to run the backend : Go to the project main folder (not crud folder) and open with "open with integrated terminal " option and run -> docker compose up --build /                                     docker compose up

API endpoint documentation :

Personnel CRUD -> 

  http://localhost:5000/api/personnel  = Create a new personnel [Method = POST]
  http://localhost:5000/api/personnel  = Get all personnel [Method = GET]
  http://localhost:5000/api/personnel/:id  = Get one personnel by ID [Method = GET]
  http://localhost:5000/api/personnel/:id  = Update personnel [Method = PUT]
  http://localhost:5000/api/personnel/:id  = Delete personnel [Method = DELETE]

Skills CRUD->

  http://localhost:5000/api/skills = Create a new skill [Method = POST]
  http://localhost:5000/api/skills = Get all skills [Method = GET]
  http://localhost:5000/api/skills/:id = Get skill by ID [Method = GET]
  http://localhost:5000/api/skills/:id = Update skill [Method = PUT]
  http://localhost:5000/api/skills/:id = Delete skill [Method = DELETE]

Personnel → Skills Assignment->

  http://localhost:5000/api/personnel/:personnelId/skills = Assign a skill to a personnel [Method = POST]
  http://localhost:5000/api/personnel/:personnelId/skills = Get skills assigned to personnel [Method = GET]
  http://localhost:5000/api/personnel/:personnelId/skills/:skillId = Update assigned skill [Method = PUT]
  http://localhost:5000/api/personnel/:personnelId/skills/:skillId = Remove assigned skill [Method = DELETE]

Projects CRUD->

  http://localhost:5000/api/projects = Create a project [Method = POST]
  http://localhost:5000/api/projects = Get all projects [Method = GET]
  http://localhost:5000/api/projects/:id = Get project by ID [Method = GET]
  http://localhost:5000/api/projects/:id = Update project [Method = PUT]
  http://localhost:5000/api/projects/:id = Delete project [Method = DELETE]

Project Required Skills->

http://localhost:5000/api/projects/:projectId/required-skills = Add required skill to project [Method = POST]
http://localhost:5000/api/projects/:projectId/required-skills = Get project required skills [Method = GET]
http://localhost:5000/api/projects/:projectId/required-skills/:skillId = Get project required skills [Method = PUT]
http://localhost:5000/api/projects/:projectId/required-skills/:skillId = Remove required skill [Method = DELETE]

Project Matching->

http://localhost:5000/api/projects/:projectId/matches = Get best personnel matches for a project [Method = GET]

Login & Register->

http://localhost:5000/api/auth/register = Register new user [Method = POST]
http://localhost:5000/api/auth/login = Login user [Method = POST]






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
