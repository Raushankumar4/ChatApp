import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, name: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXP,
    }
  );

  return token;
};

export default generateToken;
