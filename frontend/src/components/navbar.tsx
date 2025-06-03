import { useState } from 'react';
import { useNavigate } from 'react-router';
import NewBill from '../pages/home/newbill';
import { AddCircle } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';

export default function Navbar() {
  const navigate = useNavigate();
  const [addingNewBill, setAddingNewBill] = useState(false);

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
  return(
    <nav className='md:h-full md:w-[25%] p-5 bg-[#fcfaf8]'>
      {addingNewBill && <NewBill setAddingNewBill={setAddingNewBill} />}
      <h1 className='text-4xl mt-5 text-center'>Bill Tracker</h1>
      <button className='text-white !bg-gray-500' onClick={handleLogout}>Sign Out</button>
      <div className='flex flex-col items-center mt-10 p-10'>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-3 rounded-md text-[#dd493f] font-medium z-20 cursor-pointer'
         onClick={() => setAddingNewBill(!addingNewBill)}>
          <div className='w-10 flex justify-center items-center'>
            <AddCircle className={`!text-[#dd493f] ${addingNewBill ? "rotate-45" : ""}`} fontSize='large' />
          </div>
          {addingNewBill ? "Cancel" : "Add a new bill"}
        </div>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-3 rounded-md hover:text-[#dd493f] cursor-pointer'>
          <div className='w-10 flex justify-center items-center'>
            <HistoryIcon fontSize='medium' />
          </div>
          <span>View History</span>
        </div>
      </div>
    </nav>
  );

}