import { useCallback, useState } from "react";
import {
  emptyLeadFormState,
  leadFormSchema,
  type LeadFormState,
} from "../validators/lead.validator";

type FieldErrors = Partial<Record<keyof LeadFormState, string>>;

interface UseLeadFormResult {
  values: LeadFormState;
  errors: FieldErrors;
  setFieldValue: (field: keyof LeadFormState, value: string) => void;
  reset: () => void;
  validateAndGetValues: () => ReturnType<typeof leadFormSchema.safeParse>;
}

export function useLeadForm(): UseLeadFormResult {
  const [values, setValues] = useState<LeadFormState>(emptyLeadFormState);
  const [errors, setErrors] = useState<FieldErrors>({});

  const setFieldValue = useCallback(
    (field: keyof LeadFormState, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) =>
        prev[field] ? { ...prev, [field]: undefined } : prev,
      );
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(emptyLeadFormState);
    setErrors({});
  }, []);

  const validateAndGetValues = useCallback(() => {
    const result = leadFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LeadFormState | undefined;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
    }

    return result;
  }, [values]);

  return { values, errors, setFieldValue, reset, validateAndGetValues };
}
