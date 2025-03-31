import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express from "express";

dotenv.config();

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.json({ success: false, message: "Access Denied! No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
