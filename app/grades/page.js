import GradesPage from '@/components/page/grades-page';
import { requireRole } from '@/utils/require-role';

export default async function GradesRoute() {
  await requireRole('student');
  return <GradesPage />;
}
