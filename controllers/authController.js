import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import getTransporter from "../helpers/transporter.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const existingUsername = await User.findOne({ username });
  const existingEmail = await User.findOne({ email });

  if (existingUsername || existingEmail) {
    throw HttpError(
      400,
      "User with this username or email is already registered",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // TODO: handle nodemailer error and delete the User
  const user = await User.create({ email, username, password: hashedPassword });

  const emailToken = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token, emailToken });

  // Sending email verification

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${process.env.BASE_URL}/verify-email?token=${emailToken}">here</a> to verify your email.</p>`,
  });

  res.status(201).json({ token, username });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw HttpError(401, "This user is not registered");

  const pwdCheck = await bcrypt.compare(password, user.password);
  if (!pwdCheck) throw HttpError(401, "Username or password is wrong");

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(201).json({ token, username });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).end();
};

const current = async (req, res) => {
  const { _id } = req.user;
  const { token, username } = await User.findById(_id);
  res.status(200).json({ token, username });
};

// Email verification controller
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) throw HttpError(400, "Missing token");

  let email;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    email = decoded.email;
  } catch (error) {
    throw HttpError(400, "Invalid or expired token");
  }

  const user = await User.findOne({ email });
  if (!user) throw HttpError(404, "User not found");
  if (user.isVerified) throw HttpError(400, "User is already verified");

  await User.findByIdAndUpdate(user._id, {
    isVerified: true,
    emailToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
};

// Password reset request controller

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if(user) {
    const resetPasswordToken = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      // Link leads to the FE endpoint
      html: `<p>Click <a href="${process.env.BASE_URL}/reset-password?token=${resetPasswordToken}">here</a> to reset your password.</p>`,
    });
  }

  res.status(200).json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw HttpError(400, "Missing token or new password");

  let email;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    email = decoded.email;
  } catch (error) {
    throw HttpError(400, "Invalid or expired token");
  }

  const user = await User.findOne({ email });
  if (!user) throw HttpError(404, "Something went wrong");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  res.status(200).json({ message: "Password reset successful" });
};

export const ctrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  verifyEmail: ctrlWrapper(verifyEmail),
  requestPasswordReset: ctrlWrapper(requestPasswordReset),
  resetPassword: ctrlWrapper(resetPassword),
};
