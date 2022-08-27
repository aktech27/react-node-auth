import { useState } from "react";
import useFetch from "../../hooks/useFetch";
const ChangeForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { ok, data } = useFetch("/api/password/change", "PUT", { newPassword, oldPassword });

    if (ok) {
      setError(null);
      setMessage(data.message);
    }
    if (!ok) {
      setMessage(null);
      setError(data.error);
    }
    setLoading(false);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <div>Loading.....</div>}
      {error && <div>{error}</div>}
      {message && <div>{message}</div>}
      <label htmlFor="change-old">
        <h4>Old Password :</h4>
        <input id="change-old" onChange={handleOldPasswordChange} />
      </label>
      <label htmlFor="change-new">
        <h4>New Password :</h4>
        <input id="change-new" onChange={handleNewPasswordChange} />
      </label>
      <label htmlFor="change-confirm">
        <h4>Confirm New Password:</h4>
        <input id="change-confirm" onChange={handleConfirmPasswordChange} />
      </label>
      <input type="submit" />
    </form>
  );
};

export default ChangeForm;
