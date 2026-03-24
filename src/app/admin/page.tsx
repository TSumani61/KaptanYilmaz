import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';
import { getAdminSession } from '@/lib/auth';

export default function AdminPage() {
  const user = getAdminSession();

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminDashboard userName={user.name} />;
}
