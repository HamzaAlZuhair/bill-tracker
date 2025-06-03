import { useEffect } from "react";
import List from "./list";
import { useNavigate } from "react-router";
import { BillsProvider } from "../../context/bills-context";
import Navbar from "../../components/navbar";

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
  

  return (
    <BillsProvider>
      <div className='flex md:flex-row flex-col items-center justify-between h-screen bg-[#e6f4ea]'>
        <Navbar />
        <List />
      </div>
    </BillsProvider>
  );
}