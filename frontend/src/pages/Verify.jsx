import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const Verify = () => {
  const { token } = useParams();
  const Navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/verify/new/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setMessage(data.message);
        console.log("Success");
      }
      if (!response.ok) {
        setMessage(null);
        setError(data.error);
        console.log("Error", data);
      }
    };
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);
  const handleClick = () => {
    Navigate("/login");
  };
  return (
    <div>
      <h1>Account Verification</h1>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
      {loading && <div>Loading.....</div>}
      <button onClick={handleClick}>Login Now</button>
    </div>
  );
};

export default Verify;
