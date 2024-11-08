import { useEffect, useState } from "react";
import useLocalStorageState from "../context/useLocalStorage";
import { users } from "./users"; // Import the users array
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [username, setUsername] = useLocalStorageState("username", "");

  const handleLogin = () => {
    const user = users.find((u) => u.name === selectedUser);
    if (user && user.password === password) {
      setError("");
      setSelectedUser("");
      setPassword("");
      navigate("/sales");
    } else {
      setError("Invalid username or password");
    }
  };
  useEffect(() => {
    console.log(`username: ${username}`);
  }, [username]);

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Sign In</h2>
      <div>
        <select
          style={{
            width: "300px",
            height: "2rem",
            padding: "0px 10px",
            boxSizing: "border-box",
          }}
          onChange={(e) => {
            setSelectedUser(e.target.value), setUsername(e.target.value);
          }}
          value={selectedUser}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>
        <input
          style={{
            width: "400px",
            height: "2.5rem",
            padding: "0px 10px",
            boxSizing: "border-box",
          }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p style={{ color: "#fff" }}>p</p>
      )}
      <button
        style={{ width: "200px", height: "3rem", backgroundColor: "limegreen" }}
        onClick={handleLogin}
      >
        Sign In
      </button>
    </div>
  );
};

export default SignIn;
