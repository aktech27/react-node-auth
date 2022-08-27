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
      const { ok, data } = useFetch(`/api/verify/new/${token}`, "PUT");

      if (ok) {
        setError(null);
        setMessage(data.message);
        console.log("Success");
      }
      if (!ok) {
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
