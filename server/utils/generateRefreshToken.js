import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  const updateUserRefreshToken = await UserModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};

export default generateRefreshToken;
