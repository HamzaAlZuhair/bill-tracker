import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/auth-context';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signup, setSignup] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (response.ok) {
        setAccessToken(response.headers.get('Authorization'));
        navigate('/');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in.');
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: username,
      email: email,
      password: password,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (response.ok) {
        alert('Signup successful! ');
        setAccessToken(response.headers.get('Authorization'));
        navigate('/');
      } else {
        alert('Signup failed. Email already exists or invalid data.');
      }
    }
    catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred while signing up.');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#e6f4ea]">
      <h1 className="text-8xl m-10 font-[pristina]">Bill Tracker</h1>
      <h2 className="text-2xl mb-10">Never forget to pay your bills again!</h2>
      <p>Please enter your credentials to {signup ? 'sign up' : 'log in'}</p>
      <form onSubmit={signup ? handleSignup : handleLogin} className="flex flex-col items-center shadow-xl p-5 rounded-xl m-5">
      <input
          type="text"
          placeholder="Username..."
          className={`${signup ? '' : 'hidden'} w-full my-2 p-2 rounded-xl border border-gray-300 bg-white outline-none`}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email..."
          className="w-full my-2 p-2 rounded-xl border border-gray-300 bg-white outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password..."
          className="w-full my-2 p-2 rounded-xl border border-gray-300 bg-white outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">
          {signup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p>{signup ? 'already have an account?' : "don't have an account?"}</p>
        <a
          className="mt-2 cursor-pointer"
          onClick={() => setSignup(!signup)}
        >{signup ? 'Login' : 'Sign Up'}</a>
    </div>
  );
}