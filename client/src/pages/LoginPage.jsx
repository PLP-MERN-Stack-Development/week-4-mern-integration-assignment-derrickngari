import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setform] = useState({ email: '', password: '' });
  const { user, setUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = (/[a-z]/).test(password);
    const number = /[0-9]/.test(password);  
    const special = (/[^A-Za-z0-9]/).test(password);
    return {length, upper, lower, number, special };
  }

  const isPasswordValid = () => {
    const checks = validatePassword(form.password);
    return Object.values(checks).every(Boolean)
  }

  const validateForm = () => {
    if (!form.email) {
      setError('Email is required');
    }
      else if (!validateEmail(form.email)) {
      setError('Invalid email');
    } else if (!isPasswordValid()) {
      setError('Password does not meet all requirements');
    } else {
      setError('');
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/login",
          form
        );
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("token", res.data.token);
        setform({ email: "", password: "" });
        setError("");
        console.log(form);
        console.log(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="border-1 border-gray-800 bg-slate-900 shadow-md px-18 flex flex-col items-center justify-center mt-20 min-h-[60vh] rounded">
      <h1 className="text-2xl font-bold">Log in</h1>
      {error && (
        <p className="text-pink-600 text-center text-xs mt-3">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col mx-auto px-4 py-2">
        <label className="text-sm">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="border-1 border-emerald-500 bg-slate-800 p-2 w-full my-2.5 rounded-md text-sm outline-none"
          value={form.email}
          onChange={handleChange}
        />
        <label className="text-sm">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="border-1 border-emerald-500 bg-slate-800 p-2 w-full my-2.5 rounded-md text-sm outline-none"
          value={form.password}
          onChange={handleChange}
        />
        <button
          className="mt-5 w-full text-center hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-6 py-2 rounded outline-none"
          type="submit"
        >
          Login
        </button>
        <p className="text-xs mt-2">
          Not registered yet?{" "}
          <Link className="text-emerald-500" to={"/register"}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
