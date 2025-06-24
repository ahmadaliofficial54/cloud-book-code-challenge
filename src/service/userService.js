import axios from "../config/Axios";

// Fetch all users
export const fetchAllUsers = () => {
  return axios.get("/users");
};

// Create a new user (register)
export const createUser = async (userData) => {
  return await axios.post("/users", userData);
};

// Authenticate user (login)
export const authenticateUser = async (email, password) => {
  // Fetch all users and check credentials client-side (since json-server has no auth)
  const response = await fetchAllUsers();
  const user = response.data.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    // Simulate a token
    const token = btoa(`${user.email}:${user.password}`);
    return {
      token,
      email: user.email,
      id: user.id,
      role: user.role,
      message: "Login successful"
    };
  } else {
    throw new Error("Invalid email or password");
  }
}; 