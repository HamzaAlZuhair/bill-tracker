import User from '../models/user-model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY as string, {
    expiresIn: '1m',
  });
}

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY as string, {
    expiresIn: '30d',
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
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());
      res.header('Access-Control-Expose-Headers', 'Authorization');
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        
      }).header('Authorization', accessToken);
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
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());
      res.header('Access-Control-Expose-Headers', 'Authorization');
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,

      }).header('Authorization', accessToken);
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
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string);
    const newAccessToken = generateAccessToken((decoded as any).id);
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header('Authorization', newAccessToken).status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(401).json({ message: "Error verifying" });
  }
}

const logoutUser = (req: any, res: any) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: false });
  res.status(200).send({ message: "Logged out successfully" });
}

const refreshAccessToken = (req: any, res: any) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string);
    const newAccessToken = generateAccessToken((decoded as any).id);
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header('Authorization', newAccessToken).status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(400).json({ message: "Error refreshing access token" });
  }

}

export { registerUser, loginUser, verifyUser, logoutUser, refreshAccessToken };