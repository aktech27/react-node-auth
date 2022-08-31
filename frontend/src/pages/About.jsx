import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/Providers/AuthContext";
import useFetch from "../hooks/useFetch";

const About = () => {
  const Navigator = useNavigate();
  const { token } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      Navigator("/login");
    }
  }, [token]);
  useEffect(() => {
    const fetchData = async () => {
      const { ok, data } = await useFetch(`/api/data/account`, "GET");

      if (ok) {
        setError(null);
        setMessage(data);
        console.log(data);
      }
      if (!ok) {
        setMessage(null);
        setError(data.error);
      }
    };
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div>
      <h1>This is About</h1>
      <div>
        <h3>Name : </h3>
        {message?.name}
        <h3>Email : </h3>
        {message?.email}
        <h3>Creation : </h3>
        {new Date(message?.createdAt).toLocaleString()}
        <h3>Verified : </h3>
        {message?.accountVerified ? "Yes" : "No"}
        <h3>Previous Login Time : </h3>
        {new Date(message?.lastLogin[0]).toLocaleString()}
        <h3>Current Session Login Time : </h3>
        {new Date(message?.lastLogin[1]).toLocaleString()}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default About;
