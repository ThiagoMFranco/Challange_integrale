import { useState, type FormEvent } from 'react';
import { LEAD_ORIGIN_LABELS, LEAD_ORIGIN_VALUES } from '@integrale/shared';
import { useLeadForm } from '../../hooks/useLeadForm';
import { useCreateLead } from '../../hooks/useCreateLead';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface LeadFormProps {
  /** Optional hook for callers that want to react to a successful create. */
  onLeadCreated?: () => void;
}

export function LeadForm({ onLeadCreated }: LeadFormProps = {}) {
  const { values, errors, setFieldValue, reset, validateAndGetValues } = useLeadForm();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    reset();
    setShowSuccess(true);
    onLeadCreated?.();
  };

  const { isSubmitting, submitError, submit, clearError } = useCreateLead(handleSuccess);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSuccess(false);

    const result = validateAndGetValues();
    if (!result.success) {
      return;
    }

    await submit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label="Nome" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setFieldValue('name', e.target.value)}
          hasError={Boolean(errors.name)}
          placeholder="Nome do lead"
        />
      </FormField>

      <FormField label="E-mail" htmlFor="email" error={errors.email} required>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setFieldValue('email', e.target.value)}
          hasError={Boolean(errors.email)}
          placeholder="email@exemplo.com"
        />
      </FormField>

      <FormField label="Telefone" htmlFor="phone" error={errors.phone} required>
        <Input
          id="phone"
          value={values.phone}
          onChange={(e) => setFieldValue('phone', e.target.value)}
          hasError={Boolean(errors.phone)}
          placeholder="(00) 00000-0000"
        />
      </FormField>

      <FormField label="Empresa" htmlFor="company" error={errors.company}>
        <Input
          id="company"
          value={values.company}
          onChange={(e) => setFieldValue('company', e.target.value)}
          hasError={Boolean(errors.company)}
          placeholder="Opcional"
        />
      </FormField>

      <FormField label="Origem" htmlFor="origin" error={errors.origin} required>
        <Select
          id="origin"
          value={values.origin}
          onChange={(e) => setFieldValue('origin', e.target.value)}
          hasError={Boolean(errors.origin)}
        >
          <option value="" disabled>
            Selecione a origem
          </option>
          {LEAD_ORIGIN_VALUES.map((origin) => (
            <option key={origin} value={origin}>
              {LEAD_ORIGIN_LABELS[origin]}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Observações" htmlFor="notes" error={errors.notes}>
        <Textarea
          id="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => setFieldValue('notes', e.target.value)}
          hasError={Boolean(errors.notes)}
          placeholder="Opcional"
        />
      </FormField>

      {submitError && (
        <Alert variant="error" onDismiss={clearError}>
          {submitError}
        </Alert>
      )}

      {showSuccess && (
        <Alert variant="success" onDismiss={() => setShowSuccess(false)}>
          Lead cadastrado com sucesso!
        </Alert>
      )}

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar lead'}
      </Button>
    </form>
  );
}
