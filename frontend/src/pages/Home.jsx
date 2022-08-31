import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/Providers/AuthContext";

const Home = () => {
  const Navigator = useNavigate();
  const { token, dispatch } = useContext(AuthContext);

  //Check if already logged in or not
  useEffect(() => {
    if (!token) {
      Navigator("/login"); //re-route to login page
    }
  }, [token]);

  const handleClick = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div>
      <h1>This is Home</h1>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Home;
