import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./pages/SettingsPage";
import SearchUserPage from "./pages/SearchUserPage";
import Messenger from "./pages/Messenger";
import { useSelector } from "react-redux";

function App() {
  const location = useLocation();
  const hideSidebarPaths = ["/","/login", "/register"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const user = useSelector((state) => state.user.currentUser);


  return (
    <div className="h-full w-full">
     {shouldShowSidebar && <Sidebar />}
      <div className={`w-full overflow-hidden ${shouldShowSidebar ? 'lg:pl-64 md:pl-24' : 'ml-0'}`}>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchUserPage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path="/msgs/:id" element={<ProtectedRoute><Messenger/></ProtectedRoute>} />

  {/* ✅ User profile route with dynamic id */}
  <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

  {/* ✅ Redirect /profile to current user profile */}
  <Route
    path="/profile"
    element={
      user ? (
        <Navigate to={`/profile/${user.id}`} replace />
      ) : (
        <Navigate to="/login" replace />
      )
    }
  />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
        </div>
    </div>

  );
}

export default App;
