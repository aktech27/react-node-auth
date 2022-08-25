import { useState } from "react";

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = await fetch("/api/password/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();

    if (response.ok) {
      setError(null);
      setMessage(data.message);
    }
    if (!response.ok) {
      setMessage(null);
      setError(data.error);
    }
    setLoading(false);
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    const response = await fetch("/api/password/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (response.ok) {
      setError(null);
      setMessage(data.message);
      setStep(2);
    }
    if (!response.ok) {
      setMessage(null);
      setError(data.error);
    }
    setLoading(false);
  };

  const handleOTPSubmit = async () => {
    setLoading(true);

    const response = await fetch("/api/verify/otp", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ OTP }),
    });
    const data = await response.json();
    if (response.ok) {
      setError(null);
      setMessage(data.message);
      setStep(3);
    }
    if (!response.ok) {
      setMessage(null);
      setError(data.error);
    }

    setLoading(false);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };
  const handleNPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleCPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1>Step : {step}</h1>
      {error && <div>{error}</div>}
      {message && <div>{message}</div>}
      {step == 1 ? (
        <div>
          <label htmlFor="forgot-email">
            <h4>Email :</h4>
            <input id="forgot-email" onChange={handleEmailChange} />
          </label>
          <button type="button" onClick={handleEmailSubmit}>
            Get OTP
          </button>
        </div>
      ) : null}
      {step == 2 ? (
        <div>
          <label htmlFor="forgot-otp">
            <h4>OTP :</h4>
            <input id="forgot-otp" onChange={handleOTPChange} />
          </label>
          <button type="button" onClick={handleOTPSubmit}>
            Verify OTP
          </button>
        </div>
      ) : null}
      {step == 3 ? (
        <div>
          <div>
            <label htmlFor="new-password">
              <h4>New Password :</h4>
              <input
                id="new-password"
                onChange={handleNPasswordChange}
              />
            </label>
            <label htmlFor="confirm-password">
              <h4>Re-enter New Password :</h4>
              <input
                id="confirm-password"
                onChange={handleCPasswordChange}
              />
            </label>
            <button type="submit" onClick={handleFormSubmit}>
              Reset Password
            </button>
          </div>
        </div>
      ) : null}
      {loading && <div>Loading.....</div>}
    </form>
  );
};

export default ForgotForm;
