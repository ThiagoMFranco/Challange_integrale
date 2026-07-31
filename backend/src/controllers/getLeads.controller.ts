import { Request, Response } from "express";
import { listLeadsFiltersSchema } from "../validators/getLeads.validator.js";
import { getLeads as getLeadsService } from "../services/getLeads.service.js";
import { handleError } from "../utils/error-handler.js";
import { ApiResponse } from "../types/leads.types.js";

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = listLeadsFiltersSchema.parse(req.query);
    const result = await getLeadsService(filters);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: "Leads fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(error, res);
  }
};
