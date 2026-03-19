import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import VastuAnalysis from './pages/energy-vastu/VastuAnalysis'
import Home from './pages/home/Home'
import LoginLayout from './layout/LoginLayout'
import DefaultLayout from './layout/DefaultLayout'

const App : React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vastu-analysis" element={<VastuAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
