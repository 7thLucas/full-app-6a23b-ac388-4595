import { Router, type Request, type Response } from "express";
import { classService } from "../services/class.service";

const router = Router();

// GET /api/classes — all classes
router.get("/api/classes", async (_req: Request, res: Response) => {
  try {
    const classes = await classService.getAllClasses();
    res.json({ success: true, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch classes" });
  }
});

// GET /api/classes/:id — single class
router.get("/api/classes/:id", async (req: Request, res: Response) => {
  try {
    const entry = await classService.getClassById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Class not found" });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch class" });
  }
});

// POST /api/classes — create
router.post("/api/classes", async (req: Request, res: Response) => {
  try {
    const entry = await classService.createClass(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || "Failed to create class" });
  }
});

// PUT /api/classes/:id — update
router.put("/api/classes/:id", async (req: Request, res: Response) => {
  try {
    const entry = await classService.updateClass(req.params.id, req.body);
    if (!entry) return res.status(404).json({ success: false, message: "Class not found" });
    res.json({ success: true, data: entry });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || "Failed to update class" });
  }
});

// DELETE /api/classes/:id — delete
router.delete("/api/classes/:id", async (req: Request, res: Response) => {
  try {
    await classService.deleteClass(req.params.id);
    res.json({ success: true, message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete class" });
  }
});

export default router;
