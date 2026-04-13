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
import AdminLoginLayout from "./layout/admin/AdminLoginLayout";
import AdminLoginPage from "./pages/admin-panel/login/AdminLoginPage";
import AdminForgotPassword from "./pages/admin-panel/login/AdminForgotPassword";
import AdminDefaultLayout from "./layout/admin/AdminDefaultLayout";
import AdminDashboard from "./pages/admin-panel/home/AdminDashboard";
import AdminUsers from "./pages/admin-panel/user/UserList";
import AdminUserInfo from "./pages/admin-panel/user/UserInformation";
import AdminPackageList from "./pages/admin-panel/package/AdminPackageList";
import AdminPackageInfo from "./pages/admin-panel/package/AdminPackageInfo";
import AdminPlanList from "./pages/admin-panel/plan/AdminPlanList";
import AdminPlanInfo from "./pages/admin-panel/plan/AdminPlanInfo";
import LoshuGridMastery from "./pages/loshu-grid/LoshuGridMastery";

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

          <Route path="/numerology">
            <Route path="loshu-grid-mastery" element={<LoshuGridMastery />} />
          </Route>
          
        </Route>
        </Route>

        {/* Admin Panel  */}
        <Route path="/admin">
          <Route element={<AdminLoginLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="forgort-password" element={<AdminForgotPassword />} />
          </Route>

          <Route element={<AdminDefaultLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users">
              <Route index element={<AdminUsers />} />
              <Route path="info" element={<AdminUserInfo />} />
            </Route>

            <Route path="plans">
              <Route index element={<AdminPlanList />} />
              <Route path="info" element={<AdminPlanInfo />} />
            </Route>

            <Route path="packages">
              <Route index element={<AdminPackageList />} />
              <Route path="info" element={<AdminPackageInfo />} />
            </Route>
          </Route>
        </Route>
        {/* End Admin Panel */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
