import billList from "../models/bill-list-model";

const saveBill = async (req: any, res: any) => {
  try {
    // Extract data from the request body
    const { bills } = req.body;
    const email = req.user.email;
    const user_name = req.user.username;
    // Update the bills array or create a new document if none exists
    const updatedBillList = await billList.findOneAndUpdate(
      { email }, // Find the document by email
      { 
        $setOnInsert: { email, user_name }, // Set user_name only if creating a new document
        $push: { bills } // Add the new bill to the bills array
      },
      { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
    );

    // Send a success response
    res.status(200).json({
      message: "Bill added successfully",
      data: updatedBillList,
    });
  } catch (error: any) {
    // Handle errors
    res.status(500).json({
      message: "An error occurred while adding the bill",
      error: error.message,
    });
  }
}

const getBills = async (req: any, res: any) => {
  try {
    const email = req.user.email;

    // Find the bill list by email
    const billListData = await billList.findOne({ email });

    // If no data found, return a message
    if (!billListData) {
      return res.status(404).json({ message: "No bills found for this user" });
    }

    // Send the bill list data as a response
    res.status(200).json({bills: billListData.bills});
  }
  catch (error: any) {
    // Handle errors
    res.status(500).json({
      message: "An error occurred while retrieving the bills",
      error: error.message,
    });
  }
}


const updateBill = async (req: any, res: any) => {
  try {
    const { billId } = req.params;
    const { bill_name, bill_amount, bill_due_date, bill_issue_date, bill_status } = req.body;
    const email = req.user.email;
    
    // Find the document and update the specific bill in the array
    const result = await billList.findOneAndUpdate(
      { 
        email, 
        "bills._id": billId // Find the document containing the bill with this ID
      },
      { 
        $set: { 
          "bills.$.bill_name": bill_name,
          "bills.$.bill_amount": bill_amount,
          "bills.$.bill_due_date": bill_due_date,
          "bills.$.bill_issue_date": bill_issue_date,
          "bills.$.bill_status": bill_status
        } 
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({
      message: "Bill updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred while updating the bill",
      error: error.message,
    });
  }
};


const deleteBill = async (req: any, res: any) => {
  try {
    const { billId } = req.params;
    const email = req.user.email;
    
    // Find the document and pull the specific bill from the array
    const result = await billList.findOneAndUpdate(
      { email },
      { 
        $pull: { 
          bills: { _id: billId } 
        } 
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({
      message: "Bill deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred while deleting the bill",
      error: error.message,
    });
  }
};

export { saveBill, getBills, updateBill, deleteBill }; 
