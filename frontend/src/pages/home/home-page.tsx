import { useEffect } from "react";
import List from "./list";
import NewBill from "./newbill";
import { useNavigate } from "react-router";
import { BillsProvider } from "../../context/bills-context";
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User verified:", data);
      }
      else {
        console.log("User not verified");
        navigate("/login");
      }
    }
    verifyUser();
    
  }, []);
  const handleLogout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      navigate("/login");
    }
    else {
      console.log("Logout failed");
    }
  }

  return (
    <BillsProvider>
      <div className='flex flex-col items-center justify-evenly h-screen bg-[#e6f4ea]'>
        <div className='flex flex-row flex-start w-full px-5 fixed top-4'><button className='text-white !bg-gray-500' onClick={handleLogout}>Sign Out</button></div>
        <h1 className='text-4xl'>Bill Tracker</h1>
        <div className="flex flex-row w-full items-center justify-evenly h-[80%] m-5">
        <List />
        <NewBill />
        </div>
      </div>
    </BillsProvider>
  );
}