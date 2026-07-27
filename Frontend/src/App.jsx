import React from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from './Pages/ProfilePage'
import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"

const App = () => {
  return (
    <div className='text-red-500'>
      <Navbar />
      <Routes>
        <Route path='/homepage' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
      </Routes>

    </div>
  )
}

export default App
