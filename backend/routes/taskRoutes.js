import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const taskRouter = express.Router();
const prisma = new PrismaClient();

taskRouter.get("/", authenticateUser, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({ where: {userId: req.userId} });
        return res.json(tasks);
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

taskRouter.post("/", authenticateUser, async (req, res) => {
    try {
        const { content } = req.body;
        const task = await prisma.task.create({ data: { content, userId: req.userId } });
        return res.json(task);
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

taskRouter.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, completed } = req.body;

        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
        if (!task || (task.userId !== req.userId)) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { content, completed },
        });
        return res.json({ success: true, message: "Task Updated Successfully", updatedTask });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

taskRouter.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
        if (!task || (task.userId !== req.userId)) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await prisma.task.delete({ where: { id: parseInt(id) } });
        return res.json({ success: true, message: "Task Deleted" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

export default taskRouter;