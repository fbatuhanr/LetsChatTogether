import { useEffect, useState } from 'react'
import './App.css'

import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { Events } from './components/Events';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';


import StoreProvider from './providers/StoreProvider';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Layout from './Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuestGuard from './guards/GuestGuard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import UserGuard from './guards/UserGuard';

function App() {

  const [isConnected, setIsConnected] = useState<any>(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>([]);

  useEffect(() => {

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents((previous: any) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  /*return (

    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
  */

  return (
    <div className="bg-[rgb(13,13,13)] text-white font-outfit overflow-x-hidden">
      <StoreProvider>
        <ToastContainer />
        <Router>
          <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
              <Route path="/signup" element={<GuestGuard><Signup /></GuestGuard>} />

              <Route path="/chat" element={<UserGuard><Chat /></UserGuard>} />
              <Route path="/profile" element={<UserGuard><Profile /></UserGuard>} />
            </Routes>
          </Layout>
          <Footer />
        </Router>
      </StoreProvider>
    </div>
  )
}

export default App
