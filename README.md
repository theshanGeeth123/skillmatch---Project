SkillFusion - is a streamlined system for managing personnel, skills and projects with automated matching to identify the best-fit team members based on required skills.

Tech Stack: Node.js + Express + MySQL + React + Docker

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Home.png?raw=true)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Login.png?raw=true)

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

  http://localhost:5000/api/personnel  = Create a new personnel [Method = POST] ,
  http://localhost:5000/api/personnel  = Get all personnel [Method = GET] ,
  http://localhost:5000/api/personnel/:id  = Get one personnel by ID [Method = GET] ,
  http://localhost:5000/api/personnel/:id  = Update personnel [Method = PUT] ,
  http://localhost:5000/api/personnel/:id  = Delete personnel [Method = DELETE] ,

Skills CRUD->

  http://localhost:5000/api/skills = Create a new skill [Method = POST] ,
  http://localhost:5000/api/skills = Get all skills [Method = GET] ,
  http://localhost:5000/api/skills/:id = Get skill by ID [Method = GET] ,
  http://localhost:5000/api/skills/:id = Update skill [Method = PUT] ,
  http://localhost:5000/api/skills/:id = Delete skill [Method = DELETE] ,

Personnel → Skills Assignment->

  http://localhost:5000/api/personnel/:personnelId/skills = Assign a skill to a personnel [Method = POST] ,
  http://localhost:5000/api/personnel/:personnelId/skills = Get skills assigned to personnel [Method = GET] ,
  http://localhost:5000/api/personnel/:personnelId/skills/:skillId = Update assigned skill [Method = PUT] ,
  http://localhost:5000/api/personnel/:personnelId/skills/:skillId = Remove assigned skill [Method = DELETE] ,

Projects CRUD->

  http://localhost:5000/api/projects = Create a project [Method = POST] ,
  http://localhost:5000/api/projects = Get all projects [Method = GET] ,
  http://localhost:5000/api/projects/:id = Get project by ID [Method = GET] ,
  http://localhost:5000/api/projects/:id = Update project [Method = PUT] ,
  http://localhost:5000/api/projects/:id = Delete project [Method = DELETE] ,

Project Required Skills->

http://localhost:5000/api/projects/:projectId/required-skills = Add required skill to project [Method = POST] ,
http://localhost:5000/api/projects/:projectId/required-skills = Get project required skills [Method = GET] ,
http://localhost:5000/api/projects/:projectId/required-skills/:skillId = Get project required skills [Method = PUT] ,
http://localhost:5000/api/projects/:projectId/required-skills/:skillId = Remove required skill [Method = DELETE] ,

Project Matching->

http://localhost:5000/api/projects/:projectId/matches = Get best personnel matches for a project [Method = GET] ,

Login & Register->

http://localhost:5000/api/auth/register = Register new user [Method = POST] ,
http://localhost:5000/api/auth/login = Login user [Method = POST] ,

Database Schema Script -> 

Dont need to run sql commands separately , All the essential tables created when project run

  crud/db/connection.js includes all the sql commands.

Required API Tests:

1)POST - Create a new personnel (show request body and successful response)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Create%20a%20new%20personnel.png?raw=true)

2)GET - Retrieve all personnel (show response with data)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Retrieve%20all%20personnel.png?raw=true)

3)PUT - Update a skill (show request body and response)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Update%20a%20skill.png?raw=true)

4)POST - Assign a skill to personnel (show request and response)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Assign%20a%20skill%20to%20personnel.png?raw=true)

5)GET - Matching algorithm endpoint (show project requirements and matched personnel response)

![image alt](https://github.com/theshanGeeth123/skillmatch---Project/blob/main/Matching%20algorithm%20endpoint.png?raw=true)


Additional Feature:

User can view Statics using Charts / This web project can use several users , user can create own account and managae their activities without conficting with others data.








