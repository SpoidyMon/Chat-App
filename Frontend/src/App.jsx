import Navbar from './Components/Navbar'
import ProfilePage from './Pages/ProfilePage'
import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"

import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from "lucide-react"
import { useAuthStore } from './Store/UseAuthStore'
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './Store/UseThemeStore.js'

const App = () => {
  const { authUser, isCheckingAuth, checkAuth ,onlineUsers} = useAuthStore();
  const {theme}=useThemeStore()
  console.log(onlineUsers)

  useEffect(() => {
    checkAuth()

  }, [checkAuth])

  // console.log(authUser)

  if (isCheckingAuth && !authUser) {
    return (<div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div >)
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
