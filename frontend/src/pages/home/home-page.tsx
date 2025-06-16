import { useEffect, useState } from "react";
import List from "./list";
import { useNavigate } from "react-router";
import { BillsProvider } from "../../context/bills-context";
import { useAuth } from "../../context/auth-context";
import Navbar from "../../components/navbar";

export default function Home() {
  const navigate = useNavigate();
  const [billsToShow, setBillsToShow] = useState("due this month");
  const { refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      const newToken = await refreshAccessToken();
      if (newToken) {
        console.log("User verified");
      } else {
        console.log("Error verifying user, redirecting to login");
        navigate("/login");
      }
      setLoading(false);
    }
    verifyUser();
    
  }, []);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-[#e6f4ea]">Loading...</div>;
  }
  return (
    <BillsProvider>
      <div className='flex md:flex-row flex-col items-center justify-between h-screen bg-[#e6f4ea]'>
        <Navbar setBillsToShow={setBillsToShow} />
        <List billsToShow={billsToShow} />
      </div>
    </BillsProvider>
  );
}