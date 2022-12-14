import "./RegisterForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const LoginForm = () => {
  const Navigator = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { ok, data } = await useFetch("/api/auth/signup", "POST", { name, email, password });

    if (ok) {
      setError(null);
      console.log("Success");
      Navigator("/login");
    }
    if (!ok) {
      console.log("Error");
      setError(data.error);
    }
    setLoading(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="register-email">
        <h4>Name :</h4>
        <input id="register-email" onChange={handleNameChange} />
      </label>{" "}
      <label htmlFor="register-email">
        <h4>Email :</h4>
        <input id="register-email" onChange={handleEmailChange} />
      </label>
      <label htmlFor="register-password">
        <h4>Password :</h4>
        <input id="register-password" onChange={handlePasswordChange} />
      </label>
      <input type="submit" />
      {loading && <div>Loading.....</div>}
      {error && <div>{error}</div>}
    </form>
  );
};

export default LoginForm;
