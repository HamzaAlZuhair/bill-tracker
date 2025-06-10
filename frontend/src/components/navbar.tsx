import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NewBill from './newbill';
import { AddCircle } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PaidIcon from '@mui/icons-material/Paid';
import MenuIcon from '@mui/icons-material/Menu';
import favicon from '../assets/favicon.jpg';

export default function Navbar({ setBillsToShow }: { setBillsToShow: (billsToShow: string) => void }) {
  const navigate = useNavigate();
  const [addingNewBill, setAddingNewBill] = useState(false);
  const [userName, setUserName] = useState("");
  const [arrowClicked, setArrowClicked] = useState(false);

  useEffect(() => {
    const getUserName = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/getusername`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.username);
      } else {
        console.log("Failed to fetch username");
      }
    };
    getUserName();
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
  return(
    <nav className='md:h-full md:w-[20%] p-2 bg-[#fcfaf8]'>
      {addingNewBill && <NewBill setAddingNewBill={setAddingNewBill} />}
      <div className='flex flex-row items-center justify-between p-1'>
          <div className='flex flex-row items-center gap-2'>
            <img src={favicon} alt="pfp" className='w-10 h-10 rounded-full' />
            <p className='text-lg text-center'>{userName}</p>
          </div>
          <KeyboardArrowDownIcon className={`cursor-pointer ${arrowClicked ? "rotate-180" : ""}`} onClick={() => setArrowClicked(!arrowClicked)} />
      </div>
      <div className='flex flex-row justify-end'>
        {arrowClicked && <button className='text-white !bg-gray-500 !py-2 !px-3 transition' onClick={handleLogout}>Sign Out</button>}
      </div>
      <div className='flex flex-col items-center mt-10 gap-2'>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-2 rounded-md text-[#dd493f] font-medium z-20 cursor-pointer'
         onClick={() => setAddingNewBill(!addingNewBill)}>
          <div className='w-8 flex justify-center items-center mr-1'>
            <AddCircle className={`!text-[#dd493f] ${addingNewBill ? "rotate-45" : ""}`} fontSize='large' />
          </div>
          {addingNewBill ? "Cancel" : "Add a new bill"}
        </div>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-2 rounded-lg hover:text-[#dd493f] cursor-pointer'
        onClick={() => setBillsToShow("all bills")}>
          <div className='w-8 flex justify-center items-center'>
            <MenuIcon fontSize='medium' />
          </div>
          <span>All bills</span>
        </div>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-2 rounded-lg hover:text-[#dd493f] cursor-pointer'
        onClick={() => setBillsToShow("due this month")}>
          <div className='w-8 flex justify-center items-center'>
            <CalendarMonthIcon fontSize='medium' />
          </div>
          <span>Due this month</span>
        </div>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-2 rounded-lg hover:text-[#dd493f] cursor-pointer'
        onClick={() => setBillsToShow("overdue")}>
          <div className='w-8 flex justify-center items-center'>
            <ErrorOutlineIcon fontSize='medium' />
          </div>
          <span>Overdue</span>
        </div>
        <div className='flex flex-row justify-start items-center w-full hover:bg-[#dd493f22] p-2 rounded-lg hover:text-[#dd493f] cursor-pointer'
        onClick={() => setBillsToShow("paid")}>
          <div className='w-8 flex justify-center items-center'>
            <PaidIcon fontSize='medium' />
          </div>
          <span>Paid</span>
        </div>
      </div>
    </nav>
  );

}