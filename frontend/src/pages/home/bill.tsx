import { useState } from "react";
import { useBills } from "../../context/bills-context";

export default function Bill({
  id,
  name,
  amount,
  dueDate,
  issueDate,
  status
}: {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: string;
}) {
  const { fetchBills } = useBills();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount);
  const [editDueDate, setEditDueDate] = useState(dueDate);
  const [editStatus, setEditStatus] = useState(status);
  const [editIssueDate, setEditIssueDate] = useState(issueDate);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills/updatebill/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bill_name: editName,
            bill_amount: editAmount,
            bill_due_date: editDueDate,
            bill_issue_date: editIssueDate,
            bill_status: editStatus,
          }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        fetchBills(); // Refresh the bill list
      } else {
        alert("Failed to update bill.");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("An error occurred while updating the bill.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills/deletebill/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.ok) {
        fetchBills(); // Refresh the bill list
      } else {
        alert("Failed to delete bill.");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("An error occurred while deleting the bill.");
    }
  };

  const handlePaid = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills/updatebill/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bill_name: name,
            bill_amount: amount,
            bill_due_date: dueDate,
            bill_issue_date: issueDate,
            bill_status: "paid",
          }),
        }
      );

      if (response.ok) {
        fetchBills(); // Refresh the bill list
      } else {
        alert("Failed to update bill.");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("An error occurred while updating the bill.");
    }
  }

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between ${status === 'unpaid' && dueDate < new Date().toISOString() ? 'bg-red-100' : 'bg-gray-200'} p-2 rounded-xl m-2 w-[95%] shadow-sm`}>
      {deleting && <ConfirmDelete setDeleting={setDeleting} handleDelete={handleDelete} />}
      {!isEditing ? (
        <>
          <div className="flex flex-col">
            <div className={`flex flex-row m-2 ${status ==='paid' ? 'bg-green-300/50' : 'bg-red-300/50'} py-2 px-3 rounded-full w-fit items-center`}>
              <div className={`rounded-full w-2 h-2 ${status ==='paid' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span className="text-sm">{(status === 'unpaid' && dueDate < new Date().toISOString()) ? 'Overdue' : status}</span>
            </div>
            <div>
              <p className="m-2 text-xl">{name}</p>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full">
            <p className="m-2">Amount: <span className="text-lg">{amount}</span></p>
            <p className="m-2"><span className="text-lg">Due Date: {new Date(dueDate).toLocaleDateString("en-GB")}</span></p>
            <p className="m-2"><span className="text-lg">Issue Date: {new Date(issueDate).toLocaleDateString("en-GB")}</span></p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <button className="m-2 !text-sm" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="m-2 !text-sm !bg-red-400" onClick={() => setDeleting(true)}>Delete</button>
            </div>
            {status === "unpaid" && <button className="m-2 !text-sm" onClick={handlePaid}>
              Click here when paid
            </button>}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row items-center flex-wrap">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="m-2 p-1 border rounded"
            />
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(Number(e.target.value))}
              className="m-2 p-1 border rounded"
            />
            <div className="flex flex-row items-center">
              <label htmlFor="editDueDate">Due Date:</label>
              <input
                type="date"
                id="editDueDate"
                value={editDueDate.split("T")[0]} // Assuming the date format needs adjustment
                onChange={(e) => setEditDueDate(e.target.value)}
                className="m-2 p-1 border rounded"
              />
            </div>
            <div className="flex flex-row items-center">
              <label htmlFor="editIssueDate">Issue Date:</label>
              <input
                type="date"
                id="editIssueDate"
                value={editIssueDate.split("T")[0]} // Assuming the date format needs adjustment
                onChange={(e) => setEditIssueDate(e.target.value)}
                className="m-2 p-1 border rounded"
              />
            </div>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="m-2 p-1 border rounded"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex flex-row items-center">
            <button className="m-2 bg-green-500" onClick={handleSave}>
              Save
            </button>
            <button className="m-2 bg-red-500" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const ConfirmDelete = ({ setDeleting, handleDelete }: {setDeleting: (value: boolean) => void, handleDelete:() => void}) => {

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
        <p className="text-xl text-center m-5">Are you sure you want to delete this bill?</p>
        <div className="flex flex-row items-center justify-evenly w-full">
          <button className="m-2 !bg-red-400" onClick={() => {handleDelete(); setDeleting(false);}}>Yes</button>
          <button className="m-2 !bg-gray-400" onClick={() => setDeleting(false)}>No</button>
        </div>
      </div>
    </div>
  );
}