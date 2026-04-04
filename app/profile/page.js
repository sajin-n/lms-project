import ProfilePage from '@/components/page/profile-page';
import { requireRole } from '@/utils/require-role';

export default async function ProfileRoute() {
  await requireRole('student');
  return <ProfilePage />;
}
