import User from "../models/user-model";
import jwt from "jsonwebtoken";

const userVerification = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const accessToken = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string);
    req.user = await User.findById((decoded as any).id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access token expired or invalid" });
  }
};

export default userVerification;