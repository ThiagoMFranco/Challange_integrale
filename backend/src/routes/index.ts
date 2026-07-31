import { Router } from "express";
import leadsRoutes from "./leads.routes.js";

const router: Router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/leads", leadsRoutes);

export default router;
