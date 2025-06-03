
const getUserName = async (req: any, res: any) => {
  try {
    const user = req.user; // Assuming user is populated in the request by authentication middleware
    if (user) {
      res.status(200).json({ username: user.username });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserName };