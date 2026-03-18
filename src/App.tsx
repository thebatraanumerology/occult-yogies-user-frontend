import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import VastuAnalysis from './pages/vastu-energy/VastuAnalysis'
import Home from './pages/home/Home'

const App : React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vastu-analysis" element={<VastuAnalysis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
