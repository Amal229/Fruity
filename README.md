# 🛍️ Fruity Shop 🍓🍌🍍

Welcome to **Fruity Shop**, a simple Responsive fullstack web application built with **React** (frontend) and **Node.js/Express** (backend) using **SQLite**.  

Users can **log in**, **browse products**, and **add items to a shopping cart**.  

This project demonstrates **authentication**, **product management**, and **conditional visibility** of products for each user.  

---

## ✨ Features
- 🔑 User login and **JWT authentication**
- 🛒 Browse **product listings** and view details
- 🛍️ **Add products to cart**
- 👤 **User-specific product visibility**
- 💾 **SQLite database** for storing users and products

---

## 🛠️ Technologies Used
- ⚛️ **React** (Frontend)
- 🚀 **Node.js & Express** (Backend)
- 🗄️ **SQLite** (Database)
- 🔐 **JWT Authentication**
- 🎨 **CSS / Bootstrap** (Styling)

---

## 🚀 Installation & Setup

### 1️⃣ Download or Clone
Download ZIP from GitHub or clone:
git clone https://github.com/(your-username)/(repo-name).git

### 2️⃣ Backend Setup
#### Open terminal and type:
 ```bash
cd fruity-backend
 ```
  ```bash
npm install
 ```
#### Create a .env file inside backend :
 ```bash
touch .env 
 ```
#### then type your secret key inside **SECRET**  or just copy it and paste in .env:
```bash
PORT=5000
SECRET=your_secret_key 
```
#### then run the backend in terminal:
 ```bash
npm run dev
 ```
### 3️⃣ Frontend Setup
 ```bash
 cd fruity-frontend
 ```
  ```bash
npm install
 ```
  ```bash
npm run dev
  ```
Open link appears similar to this (http://localhost:5000) in your browser

## 👤 Test Accounts for Login:
- **Email: user1@example.com| Password: Test@123**
- **Email: user2@example.com| Password: Test@123**  



## 📝 Notes
- ⚠️ The .env file is **not included**. Create your own before running.
- 🗄️ The SQLite database file is **not included**. The app will create a new one if missing once you run it.
- 🚨 If the backend keeps loading after running or port 5000 is busy, free it with this command and run again:

  ```bash
  kill -9 $(sudo lsof -t -i :5000)
  ```
  
## 🗂️ ERD :
### Entity Relationship Diagram for Database
![ERD](https://sanishtech.com/i/6907e508c8286-1762125064.png)

## 🖼️ Screenshots
### Login Page :
![LoginPage](https://sanishtech.com/i/6907e440e1dd3-1762124864.png)
### ProductsPage
![ProductPage](https://sanishtech.com/i/6907e3f33b951-1762124787.png)

### CartPage :
![CartPage](https://sanishtech.com/i/6907e491af856-1762124945.png)


## 👩‍💻 Author 
Amal Abduljalil [GitHub](https://github.com/Amal229) | [LinkedIn](https://www.linkedin.com/in/amalabduljalil/)

### 💖 *Thank you for checking out this project! Enjoy shopping for fruity fun!*🍇🍉
