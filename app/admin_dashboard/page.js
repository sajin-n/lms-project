import DashboardPage from "@/components/page/dashboard-page";
import { requireRole } from '@/utils/require-role';

export default async function AdminDashboard() {
  await requireRole('admin');

  return <DashboardPage />;
}
