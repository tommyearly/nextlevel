import { redirect } from 'next/navigation';

type Props = { searchParams: { token?: string } };

/** Legacy: magic links now point to /api/auth/verify. Redirect so old links still work. */
export default async function DashboardVerifyPage({ searchParams }: Props) {
  const token = searchParams.token;
  if (!token) redirect('/dashboard/login?error=missing');
  redirect(`/api/auth/verify?token=${encodeURIComponent(token)}`);
}
