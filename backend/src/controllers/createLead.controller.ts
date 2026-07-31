import { Request, Response } from "express";
import { createLeadSchema } from "../validators/createLead.validator.js";
import { createLead as createLeadService } from "../services/createLead.service.js";
import { handleError } from "../utils/error-handler.js";
import { ApiResponse } from "../types/leads.types.js";

export const createLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input = createLeadSchema.parse(req.body);
    const lead = await createLeadService(input);

    const response: ApiResponse<typeof lead> = {
      success: true,
      data: lead,
      message: "Lead created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
};
