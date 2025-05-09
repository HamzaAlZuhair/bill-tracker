import Bill from "./bill";
import { useEffect } from "react";
import { useBills } from "../../context/bills-context";

export default function List(){
  const { bills, fetchBills } = useBills();
  
  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="overflow-hidden h-full w-[60%] rounded-xl shadow-2xl">
      <div className="overflow-y-auto h-[100%] w-full rounded-xl flex flex-col items-center p-5 bg-[#f1f5f9]">
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