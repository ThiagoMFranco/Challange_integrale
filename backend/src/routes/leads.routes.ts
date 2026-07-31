import { Router } from "express";
import { createLead } from "../controllers/createLead.controller.js";
import { getLeads } from "../controllers/getLeads.controller.js";

const router: Router = Router();

/**
 * @route   POST /leads
 * @desc    Create a new lead
 * @access  Public
 */
router.post("/", createLead);

/**
 * @route   GET /leads
 * @desc    Get all leads with optional filters and pagination
 * @query   searchName - Filter by lead name
 * @query   searchOrigin - Filter by lead origin
 * @query   page - Page number (default: 1)
 * @query   limit - Results per page (default: 20, max: 100)
 * @access  Public
 */
router.get("/", getLeads);

export default router;
