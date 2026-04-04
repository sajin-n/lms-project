import ManageStudentsPage from '@/components/page/manage-students-page';
import { requireRole } from '@/utils/require-role';

export default async function ManageStudentsRoute() {
  await requireRole('admin');
  return <ManageStudentsPage />;
}
