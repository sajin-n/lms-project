import CoursesPage from '@/components/page/courses-page';
import { requireRole } from '@/utils/require-role';

export default async function CoursesRoute() {
  await requireRole('student');
  return <CoursesPage />;
}
