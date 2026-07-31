import { PageHeader } from '../components/layout/PageHeader';
import { LeadForm } from '../components/leads/LeadForm';

export default function CadastroPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <PageHeader
        title="Cadastro de Leads"
        description="Registre novos contatos comerciais preenchendo o formulário abaixo."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <LeadForm />
      </section>
    </div>
  );
}
