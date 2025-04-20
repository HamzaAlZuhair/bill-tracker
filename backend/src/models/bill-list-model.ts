import mongoose from "mongoose";
const billListSchema = new mongoose.Schema({
  user_name: String,
  email: String,
  bills: [
    {
      bill_name: String,
      bill_amount: Number,
      bill_due_date: Date,
      bill_issue_date: Date,
      bill_status: String
    }
  ]
});
const billList = mongoose.model("BillsList", billListSchema);

export default billList;