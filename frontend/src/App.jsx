import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/Providers/AuthContext";
import { Login, Register, Home, About, Verify, ForgotPassword, ChangePassword } from "./pages";
function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
