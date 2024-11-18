import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TrendingPage from "@pages/TrendingPage";
import FollowingPage from "@pages/FollowingPage";
import YourWork from "@pages/YourWork";
import EditorPage from "@pages/EditorPage";
import Profil from "@pages/Profil";
import Login from "@pages/Login";
import Register from "@pages/Register";
import ProtectedRoute from "@components/ProtectedRoute"; // Import du composant

const App = () => {
  return (
    <Router>
      <Routes>
        {/*  routes accessibles à tous */}
        <Route path="/" element={<TrendingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* Routes protégées */}
        <Route
          path="/FollowingPage"
          element={
            <ProtectedRoute>
              <FollowingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/YourWork"
          element={
            <ProtectedRoute>
              <YourWork />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditorPage/:postId"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        <Route path="/api/Profil/:id" element={<Profil />} />
      </Routes>
    </Router>
  );
};

export default App;
