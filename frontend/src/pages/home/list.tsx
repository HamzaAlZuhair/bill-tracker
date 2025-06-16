import Bill from "./bill";
import { useEffect } from "react";
import { useBills } from "../../context/bills-context";

export default function List({ billsToShow }: { billsToShow: string }) {
  const { bills, fetchBills } = useBills();
  
  useEffect(() => {
    fetchBills();
  }, []);

  const filterBills = () => {
    if (billsToShow === "all bills") {
      return bills;
    }
    if (billsToShow === "paid") {
      return bills.filter((bill) => bill.bill_status === "paid");
    }
    if (billsToShow === "overdue") {
  const now = new Date();
      return bills.filter((bill) => {
        const dueDate = new Date(bill.bill_due_date);
        const today = new Date(now);
        // today.setHours(0, 0, 0, 0); // set to midnight
        return (
          bill.bill_status === "unpaid" &&
          dueDate.getTime() < today.getTime() // compare only date part
        );
      });
    }
    if (billsToShow === "due this month") {
      const now = new Date();
      return bills.filter((bill) => {
        const dueDate = new Date(bill.bill_due_date);
        return (
          bill.bill_status === "unpaid" &&
          dueDate.getMonth() === now.getMonth() &&
          dueDate.getFullYear() === now.getFullYear()
        );
      });
    }
    return bills;
  };

  const filteredBills = filterBills();

  return (
    <div className="overflow-hidden md:h-[100vh] h-full md:w-[80%] w-full bg-white shadow-lg">
      <div className="overflow-y-auto h-full flex flex-col items-center p-5">
        <p className="text-lg w-[95%] m-5">{billsToShow === 'due this month' ? 'Due this month' 
        : billsToShow === "overdue" ? 'Overdue Bills' 
        : billsToShow === "all bills" ? "All bills" 
        : "Paid Bills"}</p>
        {filteredBills.length === 0 && <p>No bills found</p>}
        {filteredBills && filteredBills.map((bill, index) => {
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