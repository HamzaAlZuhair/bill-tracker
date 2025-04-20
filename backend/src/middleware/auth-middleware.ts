import User from "../models/user-model";
import jwt from "jsonwebtoken";

const userVerification = (req: any, res: any, next: any) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(req.cookies.token, process.env.TOKEN_KEY as string, async (err: any, data: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        req.user = user;
        next();
      }
      else res.json({ status: false });
    }
  });
}

export default userVerification;
