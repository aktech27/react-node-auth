import "./LoginForm.module.css";
import { useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/Providers/AuthContext";

const LoginForm = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    //Api call

    const { ok, data } = await useFetch("/api/auth/signin", "POST", { email, password });

    if (ok) {
      setError(null);
      setMessage(data.message);
      dispatch({ type: "LOGIN", payload: { token: data.token } });
    }
    if (!ok) {
      setMessage(null);
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
      {message && <div>{message}</div>}
    </form>
  );
};

export default LoginForm;
