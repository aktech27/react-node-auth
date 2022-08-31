import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Providers/AuthContext";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  const Navigator = useNavigate();
  const { token } = useContext(AuthContext);
  //Check if logged in
  useEffect(() => {
    if (token) {
      Navigator("/"); // re-route to home
    }
  }, [token]);

  const handleClick = () => {
    Navigator("/forgot-password");
  };

  return (
    <div>
      <h1>This is Login</h1>
      <LoginForm />
      <a onClick={handleClick}>Forgot Password</a>
    </div>
  );
};

export default Login;
