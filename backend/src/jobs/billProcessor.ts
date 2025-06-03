import billList from '../models/bill-list-model';
import sendEmail from '../util/mailer';

function nextMonth(oldDate: any) {
  const date = new Date(oldDate);
  date.setMonth(date.getMonth() + 1);
  return date;
}

export default async function processDailyBillsAndReminders (){
  try{
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const reminderDate = new Date(currentDate);
    reminderDate.setDate(currentDate.getDate() + 2); // Calculate the date 2 days from now

    const allUsers = await billList.find({});
    var newBills: object[] = [];

    for (const user of allUsers) {
      newBills = [];
      let billsDueSoon: any[] = [];
      for (const bill of user.bills) {
        if (bill.bill_issue_date) {
          const newIssueDate = nextMonth(new Date(bill.bill_issue_date));
          newIssueDate.setHours(0, 0, 0, 0); // Normalize issue date

          // Check if the bill's issue date is today
          if (currentDate.getTime() === newIssueDate.getTime()) {
            const newBill = {
              ...bill.toObject(), // Use toObject() if bill is a Mongoose document
              _id: undefined, // Ensure a new ID is generated
              bill_status: 'unpaid',
              bill_due_date: nextMonth(bill.bill_due_date),
              bill_issue_date: newIssueDate,
            };
            newBills.push(newBill);
            console.log(`Generating new bill for ${user.email}: ${bill.bill_name}`);
          }
        }
        // Check if the bill's due date is within the next 2 days
        if (bill.bill_status === 'unpaid' && bill.bill_due_date) {
          const dueDate = new Date(bill.bill_due_date);
          dueDate.setHours(0, 0, 0, 0); // Normalize due date

          if (dueDate.getTime() === reminderDate.getTime()) {
            billsDueSoon.push({
              name: bill.bill_name || 'Unnamed Bill',
              dueDate: dueDate.toLocaleDateString(),
            });
          }
        }
      }
      if(newBills.length){
        user.bills.push(...newBills);
        await user.save();
      }
      //send reminder email if there are bills due soon
      if (billsDueSoon.length > 0 && user.email) {
        const subject = 'Upcoming Bill Payment Reminder';
        let emailBody = `Hello ${user.user_name || 'User'},\n\nYou have the following bills due in 2 days (${reminderDate.toLocaleDateString()}):\n\n`;

        billsDueSoon.forEach(b => {
          emailBody += `- ${b.name}\n`;
        });

        emailBody += `\nPlease log in to your account to view details and make payments.\n\nThank you,\nBill Tracker Service`;

        try {
          await sendEmail(user.email, subject, emailBody);
          console.log(`Reminder email sent successfully to ${user.email} for ${billsDueSoon.length} bill(s).`);
        } catch (error) {
          console.error(`Failed to send reminder email to ${user.email}:`, error);
        }
      }
      
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}