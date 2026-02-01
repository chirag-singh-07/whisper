import type { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allUsers = await UserModel.find({ _id: { $ne: userId } }).select(
      "name email avatarUrl",
    );

    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleUploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // multer attaches file to req.file
    const file = (req as any).file as any | undefined;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Save public path to the user (served via /uploads)
    const avatarUrl = `/uploads/${file.filename}`;

    await UserModel.findByIdAndUpdate(userId, { avatarUrl });

    res.status(200).json({ message: "Avatar uploaded", avatarUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err });
  }
};

export const handleSearchUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { query } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!query || typeof query !== "string") {
      return res.status(200).json({ users: [] });
    }

    // Search by name or username, case-insensitive
    const users = await UserModel.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username avatarUrl about")
      .limit(20);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};
