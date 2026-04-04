import StudentDashboardPage from "@/components/page/student-dashboard-page";
import { requireRole } from '@/utils/require-role';

const StudentDashboard = async () => {
  await requireRole('student');
  return <StudentDashboardPage />;
};

export default StudentDashboard;
