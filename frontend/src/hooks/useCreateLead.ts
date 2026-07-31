import { useCallback, useState } from "react";
import { createLead } from "../services/leads.service";
import { ApiError } from "../services/api";
import type { LeadFormValues } from "../validators/lead.validator";

interface UseCreateLeadResult {
  isSubmitting: boolean;
  submitError: string | null;
  submit: (values: LeadFormValues) => Promise<boolean>;
  clearError: () => void;
}

export function useCreateLead(onSuccess: () => void): UseCreateLeadResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: LeadFormValues) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await createLead(values);
        onSuccess();
        return true;
      } catch (err) {
        setSubmitError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível cadastrar o lead.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const clearError = useCallback(() => setSubmitError(null), []);

  return { isSubmitting, submitError, submit, clearError };
}
