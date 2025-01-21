import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOTP from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const cookiesOption = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

export async function signUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({
        message: "Fill all the credentials",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "user already exists",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verification from Grocery-it",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error while registering user ${error.message || error}`,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );

    return res.json({
      message: "email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "provide credentials",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId;
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error while logging out: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;

    const image = req.file;

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "upload profile",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error while uploading avatar: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;

    const { name, email, mobile, password } = req.body;

    let hashedPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashedPassword }),
      }
    );

    return res.json({
      message: "user updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error while updating user details: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist",
        error: true,
        success: false,
      });
    }

    const otp = generateOTP();
    const expireTime = new Date() + 60 * 60 * 1000;

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Password reset for Grocery-it",
      html: forgotPasswordTemplate({ name: user.name, otp: otp }),
    });

    return res.json({
      message: "OTP generated, check your mail",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and OTP",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "Provide required fields",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exists",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords are not matching",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashedPassword,
    });

    return res.json({
      message: "Password updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error while resetting password: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?.id;

    const newAccessToken = await generateAccessToken(userId);

    res.cookie("accessToken", newAccessToken, cookiesOption);

    return res.json({
      message: "New access token generated",
      error: false,
      success: true,
      data: {
        accesstoken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
