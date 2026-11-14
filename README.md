# Leave Management System

A Full Stack Leave Management System developed to simplify employee leave applications and administrative approval processes.

## About the Project

The Leave Management System allows employees to apply for leave and track their application status. Administrators can view employee leave requests and approve or reject applications.

## Features

### Employee Module
- Employee registration and login
- Separate employee dashboard
- Apply for leave
- View leave application status
- Track approved and rejected applications

### Admin Module
- Admin login
- Separate admin dashboard
- View all employee leave applications
- Approve or reject leave requests
- View dashboard summary

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication**
- JSON Web Token (JWT)
- bcryptjs

**Deployment**
- GitHub
- Render

## Project Structure

```text
LeaveManageSystem/
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Leave.js
│   └── User.js
├── public/
│   ├── admin-login.html
│   ├── admin.html
│   ├── admin.js
│   ├── employee-login.html
│   ├── employee.html
│   ├── employee.js
│   ├── index.html
│   ├── login.js
│   ├── register.html
│   ├── register.js
│   └── style.css
├── routes/
│   ├── authRoutes.js
│   └── leaveRoutes.js
├── app.js
└── package.json
```

## Installation and Setup

1. Clone the repository
