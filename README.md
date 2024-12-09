# Wandermap

Wandermap is an application designed to help you track and organize your travel destinations. Whether you're looking to record places you've visited or want to plan upcoming trips, Wandermap offers a streamlined and intuitive way to store, view, and manage location details. It integrates modern technologies to provide a fast, responsive, and secure experience.

## Features

- **Location Tracking**: Record your travel destinations along with relevant details such as name, address, coordinates, and visit dates.
- **Favorites**: Mark locations you’ve visited or plan to visit as favorites for easy access.
- **Date Range**: Easily track when you visited or plan to visit a location using a date range picker.
- **Responsive Design**: The app adjusts to different screen sizes to provide a smooth user experience across devices.
- **User Authentication**: Secure user accounts and private location records.

---

## Technologies Used

### Backend

- **Bun**: A fast JavaScript runtime that powers the backend API and handles HTTP requests. [Bun Documentation](https://bun.sh/docs/api/http)
- **Hono**: A lightweight framework built on Bun for creating HTTP APIs. [Hono Documentation](https://hono.dev/docs/getting-started/bun)
- **Hono Zod Validator**: Used to validate HTTP requests with type-safe Zod schemas. [Hono Zod Validator Guide](https://hono.dev/docs/guides/validation)
- **Zod**: A TypeScript-first schema validation library for HTTP requests. [Zod Docs](https://zod.dev/)
- **Hono RPC**: Enables remote procedure calls within Hono APIs. [Hono RPC Guide](https://hono.dev/docs/guides/rpc)

### Frontend

- **React**: JavaScript library for building the user interface.
- **Vite**: Fast and modern build tool for React apps. [Vite Documentation](https://vite.dev/guide/)
- **Tailwind CSS**: Utility-first CSS framework for styling. [Tailwind Documentation](https://tailwindcss.com/docs/installation)
- **Shadcn UI**: Reusable UI components styled with Tailwind CSS. [Shadcn UI Documentation](https://ui.shadcn.com/docs/installation/vite)

### Database

- **PostgreSQL**: Relational database for storing location and user data. [PostgreSQL Documentation](https://www.postgresql.org/docs/current/datatype-numeric.html)
- **Neon**: Serverless PostgreSQL platform to scale the database with ease. [Neon Docs](https://neon.tech/)
- **Drizzle ORM**: A lightweight ORM for interacting with PostgreSQL. [Drizzle Docs](https://orm.drizzle.team/)

### State Management & API

- **Tanstack Query**: Data fetching and state management library for React. [Tanstack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- **Tanstack Router**: A flexible router for React applications. [Tanstack Router Docs](https://tanstack.com/router/latest)
- **Tanstack Form**: Manage forms in React. [Tanstack Form Docs](https://tanstack.com/form/latest)

### Authentication

- **Kinde**: Secure authentication and user management. [Kinde Docs](https://docs.kinde.com/)
- **Authenticated Routes**: Secure routes with Tanstack Router. [Authenticated Routes Guide](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)

---

## Setup Instructions

### Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js** (v16 or later)
- **Bun** (for backend)
- **Vite** (for frontend)

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/wandermap.git
   cd wandermap
   ```

2. **Install Backend Dependencies**:
   ```bash
   bun i
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   bun i
   ```
4. **Setup Environment Variables**:

   You will need to create a .env file in the root directory to store your environment variables. Make sure to replace the placeholder values with actual data.

   Example .env file:

   ```
   KINDE_DOMAIN=
   KINDE_CLIENT_ID=
   KINDE_CLIENT_SECRET=
   KINDE_REDIRECT_URI=
   KINDE_LOGOUT_REDIRECT=

   DATABASE_URL=''

   VITE_GOOGLE_MAPS_API_KEY=""
   ```

5. **Start Development Server**:

   For backend server, make sure you're in the main directory and run:
   `bun dev`

   For the frontend (React with Vite):

   ```bash
   cd frontend
   bun dev
   ```

   The app will be available at http://localhost:5173

## Authentication Configuration (Kinde)

This project uses **Kinde** for authentication. Below are the steps to configure Kinde for this project.

### Prerequisites

1.  Create a Kinde account at [Kinde.com](https://kinde.com/).
2.  Create a new application in the Kinde dashboard.

### Environment Variables

Add the following variables to your `.env` file:

```
KINDE_DOMAIN=https://example.kinde.com
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_REDIRECT_URI=http://localhost:5173/api/callback
KINDE_LOGOUT_REDIRECT=http://localhost:5173
```
