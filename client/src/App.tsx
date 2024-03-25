import { useEffect, useState } from 'react'
import './App.css'

import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { Events } from './components/Events';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';


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
    <div className="bg-[#0D0D0D] text-white font-outfit overflow-x-hidden">
      <ToastContainer />
      <Router>
        <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Layout>
        <Footer />
      </Router>
    </div>
  )
}

export default App
