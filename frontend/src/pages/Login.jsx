import LoginForm from "../components/Login/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigator = useNavigate();

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
