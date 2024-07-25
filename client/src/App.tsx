import './App.css'

import StoreProvider from './providers/StoreProvider'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Layout from './Layout'

import { Login, Signup } from './pages/auth'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { GuestGuard, UserGuard } from './guards'

import Chat from './pages/Chat'

import { Layout as AccountLayout, Profile, Settings } from './pages/account'

function App() {

  return (
    <div className="bg-[rgb(13,13,13)] text-white font-outfit overflow-x-hidden">
      <StoreProvider>
        <ToastContainer autoClose={2000} pauseOnHover={false} />
        <Router>
          <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
              <Route path="/signup" element={<GuestGuard><Signup /></GuestGuard>} />

              <Route path="/chat" element={<UserGuard><Chat /></UserGuard>} />

              <Route path="/account" element={<UserGuard><AccountLayout /></UserGuard>}>
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

            </Routes>
          </Layout>
          <Footer />
        </Router>
      </StoreProvider>
    </div>
  )
}

export default App
