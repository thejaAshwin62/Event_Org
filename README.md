
# Event Org

## Overview

**Event Org** is a powerful web application designed for registering and managing events efficiently. This platform allows users to create, update, and track their events seamlessly. Whether you’re planning a small gathering or a large conference, Event Org provides the tools you need to organize and manage your events effectively.

## Features

- **User Registration and Authentication**: Secure sign-up and login functionality for users.
- **Event Management**: Users can create, edit, and delete events with ease.
- **Booking System**: Users can register for events and manage their participation status.
- **Real-time Updates**: Instant updates on event statuses without page reloads.
- **Admin Dashboard**: Admin users can oversee all events and user registrations.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js, Material UI, styled-components, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Netlify (for frontend), Heroku (for backend)

## Installation

To get started with the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-org.git
   ```
2. Navigate to the project directory:
   ```bash
   cd event-org
   ```
3. Install dependencies for both frontend and backend:
   - For frontend:
     ```bash
     cd client
     npm install
     ```
   - For backend:
     ```bash
     cd server
     npm install
     ```
4. Create a `.env` file in the backend folder and set up your environment variables (e.g., MongoDB connection string, JWT secret).
5. Start the Project in Root folder
   ```bash
   cd server
   npm run dev
   ```

