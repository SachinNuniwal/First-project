import { useState } from "react";

function Login({ onSubmit, isLoading, errorMessage }) {
  const [userId, setUserId] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!userId.trim() || isLoading) {
      return;
    }

    await onSubmit(userId.trim());
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <p className="login-kicker">Campus Connect</p>
        <h1>Welcome to ColorFlow Chat</h1>
        <p className="login-subtitle">Enter your user ID to unlock your class and club groups.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="user-id">User ID</label>
          <input
            id="user-id"
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="e.g. student_1024"
            autoComplete="off"
            required
          />
          <button type="submit" disabled={isLoading || !userId.trim()}>
            {isLoading ? "Validating..." : "Enter Chat"}
          </button>
        </form>

        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
      </div>
    </div>
  );
}

export default Login;
