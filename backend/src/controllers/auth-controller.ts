import User from '../models/user-model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY as string, {
    expiresIn: '5h',
  });
}

const registerUser = async (req: any, res: any) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: "Invalid request body" });
  }
  const { email, username, password } = req.body;
  try{
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      email,
      username,
      password,
    });
    if (user){
      const token = generateToken(user._id.toString());
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        
      });
      res.status(201).json({
        _id: user._id,
        email: user.email,
        username: user.username,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Server error: " });
  }
}

const loginUser = async (req: any, res: any) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: "Invalid request body" });
  } 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id.toString());
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        
      }); 
      res.status(200).json({
        _id: user._id,
        email: user.email,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error: " });
  }
}

const verifyUser = (req: any, res: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
    res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Error verifying" });
  }
}

const logoutUser = (req: any, res: any) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: false });
  res.status(200).send({ message: "Logged out successfully" });
}
export { registerUser, loginUser, verifyUser, logoutUser };