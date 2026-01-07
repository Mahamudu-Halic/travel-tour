import AdminTabs from "@/components/admin/admin-tabs";
import StatsGrid from "@/components/admin/stats-grid";

interface PageProps {
  searchParams: Promise<{
    page: string;
    role:string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { page, role } = await searchParams;
  return (
    <div className="pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">
          Admin Dashboard
        </h1>
        <p className="">
          Manage tours, bookings, and monitor platform activity
        </p>
      </div>
      <StatsGrid />

     <AdminTabs page={page} role={role}/>
    </div>
  );
}
