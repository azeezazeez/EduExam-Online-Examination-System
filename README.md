<div align="center">

# 🎓 EDU ONLINE EXAMINATION SYSTEM

### 📝 Online Exams • 💳 Secure Payments • ⚡ Instant Results • 🔐 Scalable Backend

**Edu Online Examination System** is a full-stack online examination platform built using **React + TypeScript (Frontend)** and **Spring Boot + Java (Backend)**. It enables user registration, authentication, exam participation, persistent answer saving, automated evaluation, instant result generation, and payment-based exam access.

</div>

---

# 💡 Key Highlights

| 🚀  | Highlight                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------- |
| 🔌  | Built **20+ REST API operations** for authentication, users, examinations, answers, payments, and health monitoring |
| 🔐  | Implemented secure user authentication with login and registration                                                  |
| 📝  | Developed persistent exam answer management with PostgreSQL                                                         |
| ⚡   | Implemented **automated result evaluation and grading system**                                                      |
| 💳  | Integrated payment processing with **Card and UPI** support                                                         |
| 🏗️ | Structured backend using **layered architecture (Controller → Service → Repository)**                               |
| ✅   | Added request validation using **Jakarta Bean Validation**                                                          |
| 🐳  | Added **Docker support** for backend containerization                                                               |
| 📊  | Implemented score, percentage, attempted, correct, wrong-answer, and grade calculation                              |
| ⏱️  | Implemented **60-minute examination timer with automatic submission**                                               |

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      CLIENT      │
                         │ React + TS       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   REST API       │
                         │  Spring Boot     │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │       Controller Layer   │
                    │ Auth / Exam / Payment /  │
                    │ User / Health            │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Service Layer      │
                    │ User / Exam / Payment    │
                    │ Business Logic           │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Repository Layer    │
                    │      Spring Data JPA     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │   PostgreSQL   │
                         │ Users          │
                         │ Questions      │
                         │ Answers        │
                         │ Payments       │
                         └────────────────┘
```

### 🔄 Examination Workflow

```text
                USER
                  │
                  ▼
          ┌───────────────┐
          │    Register   │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │     Login     │
          └───────┬───────┘
                  │
                  ▼
          ┌────────────────┐
          │ Check Payment  │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │  Start Exam    │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Load Questions │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Save Answers   │
          │ During Exam    │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Submit Exam    │
          │ / Auto Submit  │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Evaluate       │
          │ Answers        │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Result & Grade │
          └────────────────┘
```

---

# 🚀 Features

## 👤 User Features

* 📝 User Registration
* 🔐 Secure Login & Authentication
* 👤 User Profile Management
* 📍 Store user location and education details
* 💳 Payment Status Tracking
* 💰 Exam Payment using Card or UPI
* 📝 Start Online Examination
* 📚 Retrieve Examination Questions
* 🔘 Select Answers for Questions
* 💾 Automatically Save Answers
* 🔄 Resume Examination with Previously Saved Answers
* 🧭 Question Navigator
* 📊 Track Answered and Remaining Questions
* ⏱️ 60-Minute Examination Timer
* 🚨 Automatic Exam Submission when Timer Expires
* 📤 Manual Exam Submission
* 📈 View Examination Results
* 🎯 View Score and Percentage
* 🏆 View Grade
* ✅ View Correct Answers Count
* ❌ View Wrong Answers Count
* 📊 View Attempted Questions Count

---

## 🧑‍🏫 Admin Features

* 📝 Question Bank Management through backend data layer
* 📚 Store and retrieve examination questions
* 🔑 Manage registered users through user persistence
* 💳 Manage payment records
* 📊 Track user payment status
* 🗄️ Manage examination answers
* ⚙️ Backend service-layer management for examination processing

---

## ⚙️ System Features

* 🔌 RESTful API Architecture
* 🏗️ Layered Controller → Service → Repository Architecture
* 🗄️ PostgreSQL Database Integration
* 🔄 Spring Data JPA / Hibernate Persistence
* ✅ Jakarta Bean Validation
* 📦 DTO-based API request and response handling
* 📊 Automated Result Evaluation
* 🎯 Automatic Grade Calculation
* 💾 Persistent User Answers
* 🔄 Previously Selected Answer Retrieval
* 🧮 Score and Percentage Calculation
* ⏱️ 60-Minute Examination Timer
* 🤖 Automatic Exam Submission on Timeout
* 💳 Card Payment Processing
* 📱 UPI Payment Processing
* 🔒 Card Number Masking before API response
* 🚫 Duplicate Successful Payment Prevention
* 🌐 CORS Configuration
* 🚨 Structured API Response Handling
* 🩺 Backend Health Check Endpoint
* 🐳 Dockerized Backend
* ⚡ Transactional Service Operations
* 🧹 Separation of API DTOs from persistence models

---

# 🛠 Tech Stack

### 💻 Frontend

![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?style=for-the-badge\&logo=reactrouter\&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12-000000?style=for-the-badge\&logo=framer\&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide%20React-0.546-F56565?style=for-the-badge)

### 🔧 Backend

![Java](https://img.shields.io/badge/Java%2017-ED8B00?style=for-the-badge\&logo=openjdk\&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=white)
![Spring Web](https://img.shields.io/badge/Spring%20Web-6DB33F?style=for-the-badge\&logo=spring\&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge\&logo=spring\&logoColor=white)
![Jakarta Validation](https://img.shields.io/badge/Jakarta%20Validation-ED1C24?style=for-the-badge)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge\&logo=hibernate\&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-BD2C00?style=for-the-badge\&logo=java\&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge\&logo=apachemaven\&logoColor=white)

### 🗄 Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-42.7.2-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)

### 💳 Payment

![Card Payment](https://img.shields.io/badge/Card%20Payment-Supported-4CAF50?style=for-the-badge)
![UPI](https://img.shields.io/badge/UPI-Supported-673AB7?style=for-the-badge)

### 🧰 Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge\&logo=postman\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge\&logo=intellijidea\&logoColor=white)
![Eclipse](https://img.shields.io/badge/Eclipse-2C2255?style=for-the-badge\&logo=eclipse\&logoColor=white)

---

# 🌐 API Endpoints

| Method | Endpoint                                | Description                                       |
| :----: | --------------------------------------- | ------------------------------------------------- |
| `POST` | `/api/auth/register`                    | Register a new user                               |
| `POST` | `/api/auth/login`                       | Authenticate user                                 |
|  `GET` | `/api/users/{userId}`                   | Get user information                              |
|  `GET` | `/api/exam/questions?userId={userId}`   | Get examination questions with saved-answer state |
| `POST` | `/api/exam/answers?userId={userId}`     | Save or update an answer                          |
|  `GET` | `/api/exam/answers?userId={userId}`     | Get all saved answers for a user                  |
|  `GET` | `/api/exam/result?userId={userId}`      | Calculate current examination result              |
| `POST` | `/api/exam/submit?userId={userId}`      | Submit examination and generate result            |
|  `GET` | `/api/exam/total-questions`             | Get total number of examination questions         |
| `POST` | `/api/payments/process?userId={userId}` | Process Card or UPI payment                       |
|  `GET` | `/api/payments/status?userId={userId}`  | Check user's payment status                       |
|  `GET` | `/health`                               | Check backend health                              |

---

# 👨‍💻 Author

<div align="center">

### **Azeez**

📌 Open to opportunities in **Java Backend / Full Stack Development**

</div>

---

# ⭐ Support

<div align="center">

If you like this project, give it a ⭐ on GitHub!

### 🎓 EDU ONLINE EXAMINATION SYSTEM

**Built with React • TypeScript • Vite • Java • Spring Boot • Spring Data JPA • PostgreSQL • Docker**

</div>
