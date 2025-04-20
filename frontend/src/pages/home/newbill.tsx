import { useState } from "react";
import { useBills } from "../../context/bills-context";

export default function NewBill() {
  const { fetchBills } = useBills();
  const [billName, setBillName] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<string>("unpaid");

  const handleAddBill = async () => {
    const payload = {
      bills: [
        {
          bill_name: billName,
          bill_amount: amount,
          bill_due_date: dueDate,
          bill_issue_date: issueDate,
          bill_status: status,
        },
      ],
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bills/savebill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (response.ok) {
        setBillName("");
        setAmount(0);
        setDueDate("");
        setIssueDate("");
        setStatus("unpaid");
        fetchBills(); // Refresh the bill list after adding a new bill
      } else {
        alert("Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task.");
    }
  }

  return (
    <div className="flex flex-col items-center p-5 rounded-xl m-5 bg-[#f1f5f9] shadow-2xl">
      <h1 className="text-2xl">Add a new bill</h1>
      <input
        type="text"
        placeholder="Name"
        className="w-full my-2 p-2 rounded-xl border border-gray-300"
        value={billName}
        onChange={(e) => setBillName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full my-2 p-2 rounded-xl border border-gray-300"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="flex flex-row items-center justify-between">
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          className="m-2 p-2 rounded-xl border border-gray-300"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <label htmlFor="issueDate">Issue Date:</label>
        <input
          type="date"
          id="issueDate"
          className="m-2 p-2 rounded-xl border border-gray-300"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
      </div>
      <button
        className="m-2"
        onClick={handleAddBill}
      >
        Add task
      </button>
    </div>
  );
}