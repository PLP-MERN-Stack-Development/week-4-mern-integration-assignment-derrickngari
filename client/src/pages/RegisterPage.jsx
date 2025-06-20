import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setform] = useState({ name: '',email: '', password: '' });
  const { user, setUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [showpasswordHints, setShowPasswordHints] = useState(false)
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
    if (!form.name) {
      setError('Name is required');
    } else if (!form.email) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', form);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);
      setform({ name:'', email: '', password: '' });
      setError('');
      console.log(form);
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed. Please try again.');
    }
  };

  const getPasswordStrength = (checks) => {
    const score = Object.values(checks).filter(Boolean).length;
  
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    if (score === 3 || score === 4) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
    if (score === 5) return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  
    return { label: '', color: '', width: 'w-0' };
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const passwordChecks = validatePassword(form.password);

  return (
    <div className="border-1 border-gray-800 bg-slate-900 shadow-md px-18 flex flex-col items-center justify-center mt-17 min-h-[60vh] rounded">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && (
        <p className="text-pink-600 text-center text-xs mt-3">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col mx-auto px-4 py-2">
        <label className="text-sm">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Full Name"
          className="border-1 border-emerald-500 bg-slate-800 p-2 w-full my-2.5 rounded-md text-sm outline-none"
          value={form.name}
          onChange={handleChange}
        />
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
          onFocus={()=> setShowPasswordHints(true)}
          onBlur={() => setTimeout(() => setShowPasswordHints(false), 200)}
        />
        {showpasswordHints && (
            <div className="text-xs bg-slate-950 rounded-sm border border-emerald-500 text-white p-3 mb-3 transision duration-200">
                <p className={passwordChecks.length ? 'text-green-400' : 'text-pink-500'}>
              • At least 8 characters
            </p>
            <p className={passwordChecks.upper ? 'text-green-400' : 'text-pink-500'}>
              • At least one uppercase letter
            </p>
            <p className={passwordChecks.lower ? 'text-green-400' : 'text-pink-500'}>
              • At least one lowercase letter
            </p>
            <p className={passwordChecks.number ? 'text-green-400' : 'text-pink-500'}>
              • At least one number
            </p>
            <p className={passwordChecks.special ? 'text-green-400' : 'text-pink-500'}>
              • At least one special character
            </p>

             {/* ✅ Password strength meter */}
    <div className="mt-2">
      <p className="text-xs mb-1">Strength:</p>
      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
        <div
          className={`h-full ${getPasswordStrength(passwordChecks).color} ${getPasswordStrength(passwordChecks).width} transition-all duration-300`}
        ></div>
      </div>
      <p
        className={`mt-1 text-xm font-bold ${
          getPasswordStrength(passwordChecks).label === 'Weak'
            ? 'text-red-400'
            : getPasswordStrength(passwordChecks).label === 'Medium'
            ? 'text-yellow-400'
            : 'text-green-400'
        }`}
      >
        {getPasswordStrength(passwordChecks).label}
      </p>
    </div>
            </div>
        )}
        <button
          className="mt-4 w-full text-center hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-6 py-2 rounded outline-none"
          type="submit"
        >
          Register
        </button>
        <p className="text-xs mt-2">
          Already have an account?{" "}
          <Link className="text-emerald-500" to={"/login"}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
