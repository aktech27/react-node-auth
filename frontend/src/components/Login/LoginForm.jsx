import "./LoginForm.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const Navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //Check if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      Navigator("/"); // re-route to home
    }
  }, [loading]);

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(
      `Login Form clicked\n\nEmail:${email}\n\nPassword:${password}`
    );
    //Api call
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setError(null);
      console.log("Success");
      localStorage.setItem("token", data.token);
    }
    if (!response.ok) {
      console.log("Error");
      setError(data.error);
    }
    setLoading(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="login-email">
        <h4>Email :</h4>
        <input id="login-email" onChange={handleEmailChange} />
      </label>
      <label htmlFor="login-password">
        <h4>Password :</h4>
        <input id="login-password" onChange={handlePasswordChange} />
      </label>
      <input type="submit" />
      {loading && <div>Loading.....</div>}
      {error && <div>{error}</div>}
    </form>
  );
};

export default LoginForm;
