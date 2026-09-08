import Image from "next/image";
import { login } from "./actions";

export const metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container-app flex min-h-[calc(100vh-64px)] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-card border border-navy/10 bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.svg" alt="Logo GEMARI" width={56} height={56} />
          <h1 className="mt-4 text-xl font-bold text-navy">
            Masuk ke GEMARI
          </h1>
          <p className="mt-1 text-sm text-muted">
            Gerakan Muda Mudi Blimbingsari
          </p>
        </div>

        {params.error && (
          <div className="mt-5 rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
            {params.error === "Invalid login credentials"
              ? "Email atau kata sandi salah."
              : params.error}
          </div>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirect ?? "/dashboard"}
          />
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-navy"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-navy"
            >
              Kata sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-green py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
