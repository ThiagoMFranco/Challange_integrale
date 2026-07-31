import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  // Server-only privileged key. The backend is the sole consumer of the
  // Supabase client (the frontend talks to this API, never to Supabase
  // directly), so we use the service_role key to bypass RLS instead of
  // duplicating access rules as Postgres policies. NEVER expose this key
  // to a browser/frontend context or commit it to version control.
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase service role key is required"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().default("*"),
});

type EnvVars = z.infer<typeof envSchema>;

let env: EnvVars;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Environment validation failed:");
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }
  process.exit(1);
}

export default env;
