import Bill from "./bill";
import { useEffect } from "react";
import { useBills } from "../../context/bills-context";

export default function List(){
  const { bills, fetchBills } = useBills();
  
  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="overflow-hidden md:h-[100vh] md:w-[80%] w-full bg-white">
      <div className="overflow-y-auto w-full h-full flex flex-col items-center p-5">
        {bills.length === 0 && <p>No bills found</p>}
        {bills && bills.map((bill, index) => {
          return (
            <Bill
              key={index}
              name={bill.bill_name}
              amount={bill.bill_amount}
              dueDate={bill.bill_due_date}
              issueDate={bill.bill_issue_date}
              status={bill.bill_status}
              id={bill._id}
            />
          );
        })}
        
      </div>
    </div>
  );
}