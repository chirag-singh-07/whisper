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
