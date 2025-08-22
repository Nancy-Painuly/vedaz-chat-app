# Vedaz Chat App (MVP)

A real-time 1:1 chat application built with **React Native** (frontend) and **Node.js + Express + Socket.IO** (backend), storing data in **MongoDB Atlas**. This project implements the minimum viable product (MVP) as required.

---

## Features (MVP)

- **Authentication**: Register and Login (JWT-based)  
- **User List**: Display all registered users  
- **Chat Screen**: Real-time messaging using Socket.IO  
- **Messages** persist in MongoDB  

> Advanced features like typing indicators, read receipts, and online/offline status are not included due to time constraints.

---

## Folder Structure
/mobile -> React Native frontend
/server -> Node.js backend with REST API and Socket.IO


## Prerequisites

- Node.js v18+  
- npm v9+  
- MongoDB Atlas account and cluster  


## Backend Setup

1. Navigate to the server folder:
   cd server

2.Install dependencies:
  npm install

3.Create a .env file and add:
  MONGO_URI=<Your MongoDB Atlas URI>
  PORT=5000
  JWT_SECRET=supersecret_dev_key
  CLIENT_ORIGINS=http://localhost:19006,http://127.0.0.1:19006

4.npm run start
  The server runs on http://localhost:5000


## Frontend Setup

1.Navigate to the mobile folder:
  cd mobile

2.Install dependencies:
  npm install

3.Update config.js to point to backend:
  export const BASE_URL = "http://localhost:5000";

4.Start the React Native app:
  npx expo start

                            Sample Users
Name	                        Email	                      Password
Nancy Painuly          	nancy@test.com                   password123
John Doe	               john@test.com                   password123

## How to use
1.Register a new user or login with a sample user.

2.Go to Home Screen to see all users.

3.Tap a user to start a 1:1 chat.

4.Messages are sent and received in real-time.

## NOTES

-Only MVP features implemented as per assignment.

-Backend connects to MongoDB Atlas.

-Frontend uses Expo for React Native.
