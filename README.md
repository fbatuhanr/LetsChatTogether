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

## LIVE DEMO
Client deployment on Vercel: [lets-chat-together.vercel.app](https://lets-chat-together.vercel.app) 

Server deployment on Render: [lets-chat-together.onrender.com](https://lets-chat-together.onrender.com) 

**Deployment Note:**  

Free instances may experience delays of up to 50 seconds or more due to inactivity, as they may spin down when not in use.

## Getting Started

1. **Clone the repository:**
   
```bash
   git clone https://github.com/fbatuhanr/lets-chat-together.git
```

2. **Install dependencies for frontend and backend:**

```bash
   cd lets-chat-together/client
   npm install
```
   
```bash
   cd ../server
   npm install
```
   
3. **Set up environment variables:**
   
- Create a .env file in the server directory with the following variables:
```bash
NODE_ENV=development or production
MONGODB_URI=your_mongodb_uri
PORT=your_server_port
CORS_ORIGIN=your_cors_origin
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRATION=your_access_token_expiration
REFRESH_TOKEN_EXPIRATION=your_refresh_token_expiration
```
- Create a .env file in the client directory with the following variables:
```bash
API_URL=your_api_url
AUTH_API_URL=your_auth_api_url
USER_API_URL=your_user_api_url
CHAT_API_URL=your_chat_api_url
MESSAGE_API_URL=your_message_api_url
```

4. **Run the application:**

- Start the backend server:
```bash
   cd server
   npm start
```

- Start the frontend development server:
```bash
  cd ../client
  npm run dev
```

5. **Open your browser and navigate to http://localhost:3000 to see the application in action.**

Contributing:
Feel free to submit issues or pull requests. Contributions are welcome!

##Application Live Demo Screenshots:
![lets-chat-together_chat](https://github.com/user-attachments/assets/6e527f00-975f-496d-801c-a59f56375f46)
![lets-chat-together_friends](https://github.com/user-attachments/assets/3563a48f-d541-4af9-a0aa-198c2c39b66b)
![lets-chat-together_profile](https://github.com/user-attachments/assets/a158cc99-ac8b-4e5d-a829-023468221492)
![lets-chat-together-settings](https://github.com/user-attachments/assets/bb3be8d6-df74-4405-9ed9-b6ea01e468d3)
![lets-chat-together-user-own](https://github.com/user-attachments/assets/b2a89dc9-8eed-40b1-b8c7-2cc25f9a3277)
![lets-chat-together-user](https://github.com/user-attachments/assets/4713b11f-b1af-444c-8953-a44886c43725)
![lets-chat-together-users](https://github.com/user-attachments/assets/d1ceb965-dda9-42be-b571-444419ade368)
![lets-chat-together-chat-delete](https://github.com/user-attachments/assets/1dee923a-571b-469d-bd33-844bd1356a78)

##Application Figma Design:
<img width="785" alt="Lets Chat Together Figma" src="https://github.com/user-attachments/assets/ad7632be-3a0c-415a-a5c6-dfa677cdaf02">
