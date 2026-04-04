import EditLessonsPage from '@/components/page/edit-lessons-page';
import { requireRole } from '@/utils/require-role';

export default async function EditLessonRoute() {
  await requireRole('admin');
  return <EditLessonsPage />;
}
