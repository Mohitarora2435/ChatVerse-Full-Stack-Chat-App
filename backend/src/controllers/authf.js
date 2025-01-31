import { generatetoken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generatetoken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pfp: newUser.pfp,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generatetoken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pfp: user.pfp,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { pfp } = req.body;  // Extract profile picture from request body
    const userId = req.user._id;  // Get user ID from authenticated user

    // Validate if profile picture exists
    if (!pfp) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // You can optionally validate if the base64 string is valid, but it's not mandatory

    // Upload the profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(pfp, {
      folder: "profile_pics",  // You can specify a folder name in Cloudinary
      transformation: [
        { width: 150, height: 150, crop: "fill" }  // Optional: Resize the image to 150x150
      ]
    });

    // Update the user's profile with the Cloudinary image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pfp: uploadResponse.secure_url },  // Save the Cloudinary image URL
      { new: true }
    );

    // Respond with the updated user
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in update profile:", error);  // Log the error
    res.status(500).json({ message: "Internal server error" });  // Send a generic error message
  }
};




export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
