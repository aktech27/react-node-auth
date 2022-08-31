import ChangeForm from "../components/Password/ChangeForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/Providers/AuthContext";

const ChangePassword = () => {
  const Navigator = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      Navigator("/login");
    }
  }, [token]);

  return (
    <div>
      <h1>This is ChangePassword</h1>
      <ChangeForm />
    </div>
  );
};

export default ChangePassword;
