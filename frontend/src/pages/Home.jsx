import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const Navigator = useNavigate();

  //Check if already logged in or not
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Navigator("/login"); //re-route to login page
    }
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <h1>This is Home</h1>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Home;
