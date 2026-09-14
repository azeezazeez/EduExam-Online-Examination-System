# 🎓 EDU ONLINE EXAMINATION SYSTEM

<div align="center">

### 📝 Online Exams • ⚡ Instant Results • 🔐 Secure & Scalable

**Edu Online Examination System** is a web-based platform built using **Spring Boot** that enables efficient creation, management, and evaluation of online exams.

</div>

---

# 💡 Key Highlights

| 🚀  | Highlight                                             |
| --- | ----------------------------------------------------- |
| 🔌  | Built **REST APIs** for exams, questions, and results |
| 🔐  | Implemented **secure authentication & authorization** |
| ⚡   | Designed **automated result evaluation system**       |
| 🏗️ | Structured backend using **layered architecture**     |

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      CLIENT      │
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
                    │       Service Layer      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Repository Layer    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │   PostgreSQL   │
                         └────────────────┘
```

### 🔄 Examination Workflow

```text
                ADMIN
                  │
                  ▼
          ┌───────────────┐
          │  Create Exam  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Add Questions │
          └───────────────┘


                USER
                  │
                  ▼
             ┌────────┐
             │ Login  │
             └───┬────┘
                 │
                 ▼
          ┌──────────────┐
          │ Attempt Exam │
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │    Submit    │
          └──────┬───────┘
                 │
                 ▼
          ┌────────────────┐
          │ Result Generated│
          └────────────────┘
```

---

# 🚀 Features

## 👤 User Features

* 🔐 Secure Login & Authentication
* 📝 Attempt Exams
* 📈 View Results Instantly

---

## 🧑‍🏫 Admin Features

* ➕ Create & Manage Exams
* ✏️ Add / Edit Questions
* 👥 Manage Users

---

## ⚙️ System Features

* 🤖 Automated Result Evaluation
* 🔌 RESTful API Architecture
* 🔒 Secure Data Storage
* 📈 Scalable Backend Design

---

# 🛠 Tech Stack

### 🔧 Backend

![Java](https://img.shields.io/badge/Java%208-ED8B00?style=for-the-badge\&logo=openjdk\&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge\&logo=springsecurity\&logoColor=white)

### 🗄 Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)

### 🧰 Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge\&logo=postman\&logoColor=white)
![IntelliJ](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge\&logo=intellijidea\&logoColor=white)
![Eclipse](https://img.shields.io/badge/Eclipse-2C2255?style=for-the-badge\&logo=eclipse\&logoColor=white)

---

# 📸 Screenshots

| Section           | Preview                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Register Page** | ![Register Page](https://github.com/user-attachments/assets/84f84b0f-7852-4a30-bf11-e9be06f5346e) |
| **Login Page**    | ![Login Page](https://github.com/user-attachments/assets/619215fe-0303-4b4d-8d59-eb3316815fb2)    |
| **Exam Page**     | ![Exam Page](https://github.com/user-attachments/assets/307faabe-3454-4d2b-b915-c31cb53dc39a)     |
| **Result Page**   | ![Result Page](https://github.com/user-attachments/assets/875bb673-6d11-406f-804a-dae7b3fb67c0)   |

---

# 🌐 API Endpoints

| Method | Endpoint          | Description   |
| :----: | ----------------- | ------------- |
| `POST` | `/api/auth/login` | User login    |
| `POST` | `/api/exams`      | Create exam   |
|  `GET` | `/api/questions`  | Get questions |
| `POST` | `/api/results`    | Submit exam   |

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

**Built with Java • Spring Boot • Spring Security • PostgreSQL**

</div>
