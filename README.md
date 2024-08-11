# Let's Chat Together

"Let's Chat Together" is a dynamic chat platform designed for seamless communication, both online and offline. It provides users with a comprehensive suite of features for messaging, managing friends, and handling chat interactions.

## Features

- **User Registration & Login**: Users can sign up and log in to access their profiles and settings.
- **Profile Management**: Update personal details and configure settings.
- **Friend Management**: Search for users by name, surname, or username. Send and manage friend requests, view active friends, and handle received and sent requests.
- **Real-Time Chat**: Engage in live conversations with online friends. Messages are stored and delivered once offline friends return online.
- **Message Management**: Send, delete, or clear entire chat histories.

## Technologies Used

### Frontend

- **[TypeScript](https://www.typescriptlang.org/)**: Provides type safety and enhances development productivity.
- **[React](https://reactjs.org/)** with **[Vite](https://vitejs.dev/)**: For building a fast and interactive user interface.
- **[Redux](https://redux.js.org/)** & **[Redux Persist](https://github.com/rt2zz/redux-persist)**: For global state management and persistence.
- **[React Router DOM](https://reactrouter.com/)**: For handling navigation within the application.
- **[Tailwind CSS](https://tailwindcss.com/)**: For styling and responsive design.
- **[Socket.io-client](https://socket.io/docs/v4/client-api/)**: For real-time messaging capabilities.
- **[Toastify](https://fkhadra.github.io/react-toastify/)**: For displaying toast notifications.
- **[SweetAlert2](https://sweetalert2.github.io/)**: For stylish pop-up modals.
- **[React Hook Form](https://react-hook-form.com/)**: For efficient form handling.
- **[jwt-decode](https://www.npmjs.com/package/jwt-decode)**: For decoding JWT tokens.
- **[Axios](https://axios-http.com/)**: For handling API requests.

### Backend

- **[TypeScript](https://www.typescriptlang.org/)** & **[Node.js](https://nodejs.org/)**: For a robust and scalable server-side application.
- **[Express](https://expressjs.com/)**: A minimalist web framework for Node.js.
- **[MongoDB](https://www.mongodb.com/)** with **[Mongoose](https://mongoosejs.com/)**: For NoSQL database management.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: For secure password hashing.
- **[body-parser](https://www.npmjs.com/package/body-parser)**: For parsing incoming request bodies.
- **[multer](https://www.npmjs.com/package/multer)**: For handling file uploads.
- **[cors](https://www.npmjs.com/package/cors)**: For managing cross-origin requests.
- **[socket.io](https://socket.io/)**: For real-time bidirectional communication.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: For user authentication and token management.

## JWT Authentication

- **Access & Refresh Tokens**: Users receive an access token upon login, which is used for authenticating requests. Refresh tokens are stored in cookies and used to obtain new access tokens when they expire.
- **Token Handling**: Custom Axios instance manages tokens, including automatic refreshing of expired access tokens using the refresh token.
- **Secure Endpoints**: JWT tokens are verified for protected routes using middleware to ensure secure access to resources.

## Design

The design for "Let's Chat Together" was created using Figma. You can view the full design [here](https://www.figma.com/design/hQqZzp9YHbtrdf8cFZq9an/Lets-Chat-Together---Design?node-id=0-1&t=XTE8czVsFzN4qNlX-1).

## Getting Started

1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/fbatuhanr/lets-chat-together.git

2. **Install dependencies for frontend and backend:**

   ```bash
   cd lets-chat-together/client
   npm install
   
   ```bash
   cd ../server
   npm install
   
3. **Set up environment variables:**
   
   Create .env files in both client and server directories with the required variables.

4. **Run the application:**

  Start the backend server:
   ```bash
   cd server
   npm start

  Start the frontend development server:
   ```bash
  cd ../client
  npm run dev
  ```````

zort