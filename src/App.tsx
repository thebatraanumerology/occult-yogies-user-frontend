import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/login/login";
import VastuAnalysis from "./pages/energy-vastu";
import Home from "./pages/home/Home";
import LoginLayout from "./layout/LoginLayout";
import DefaultLayout from "./layout/DefaultLayout";
import EnergyVastuAnalyse from "./pages/energy-vastu/analyse";
import EnergyVastuList from "./pages/energy-vastu/list";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/energy-vastu" element={<VastuAnalysis />} />
            <Route path="/energy-vastu/:id" element={<EnergyVastuAnalyse />} />
            <Route path="/list/energy-vastu" element={<EnergyVastuList />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
