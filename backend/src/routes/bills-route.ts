import express from "express";
import { saveBill, getBills, updateBill, deleteBill } from "../controllers/bills-controller";
import userVerification from "../middleware/auth-middleware";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json("hello world");
});

router.post("/savebill", userVerification, saveBill);
router.get("/getbills", userVerification, getBills);
router.put("/updatebill/:billId", userVerification, updateBill);
router.delete("/deletebill/:billId", userVerification, deleteBill);

export default router;