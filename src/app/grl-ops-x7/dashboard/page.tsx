import AdminSidebar from '@/components/layout/AdminSidebar';
import { PHP_API_URL } from '@/lib/config';
import { PageVisit } from '@/lib/types';

export default async function AdminDashboardPage() {
  // Fetch everything in one call to PHP get_stats
  const resp = await fetch(`${PHP_API_URL}?action=get_stats`, { cache: 'no-store' });
  const data = await resp.json();
  
  const { stats: counts, latestVisits, topPages } = data;

  const stats = [
    { label: 'Total Products',    value: counts.products || 0,        icon: 'ri-crane-line',       color: 'bg-blue-500' },
    { label: 'Unique Visitors',   value: counts.unique_visitors || 0, icon: 'ri-user-heart-line',  color: 'bg-amber-500' },
    { label: 'Total Hits',        value: counts.visits || 0,          icon: 'ri-global-line',      color: 'bg-green-500' },
    { label: 'Avg Stay (sec)',    value: Math.round(counts.avg_duration || 0), icon: 'ri-timer-line', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10">
           <h1 className="font-display font-black text-3xl text-[#060f1e]">Dashboard Overview</h1>
           <p className="text-gray-400 mt-1">Welcome back. Here is what is happening with GRL today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
               <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <i className={`${s.icon} text-2xl`}></i>
               </div>
               <div>
                  <div className="text-2xl font-black text-[#0f1f3d] leading-none mb-1">{s.value}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-display">
                    {s.label}
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Top Pages */}
           <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                 <h2 className="text-lg font-bold text-[#0f1f3d] mb-6 flex items-center gap-2">
                    <i className="ri-fire-line text-amber-500"></i> Top Accessed Pages
                 </h2>
                 <div className="space-y-4 flex-1">
                    {topPages.map((page: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                         <div className="text-sm font-bold text-gray-600 truncate mr-4">
                           {page.page.replace(/^\/company\//, '/')}
                         </div>
                         <div className="bg-[#0f1f3d] text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                           {page.count} hits
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Latest Activity */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-[#0f1f3d] mb-6 flex items-center gap-2">
                   <i className="ri-history-line text-blue-500"></i> Recent Traffic
                 </h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead>
                          <tr className="text-[#0f1f3d] font-bold border-b border-gray-100">
                             <th className="pb-4">Location</th>
                             <th className="pb-4">Platform</th>
                             <th className="pb-4">IP Address</th>
                             <th className="pb-4 text-right">Visited At</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {latestVisits.map((visit: PageVisit, i: number) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                               <td className="py-4 font-semibold text-gray-600 truncate max-w-[200px]">
                                 {visit.page.replace(/^\/company\//, '/')}
                               </td>
                               <td className="py-4 text-gray-400 text-xs">
                                 {visit.user_agent.split(' ')[0]}...
                               </td>
                               <td className="py-4 text-gray-400 font-mono text-xs">
                                 {visit.ip}
                               </td>
                               <td className="py-4 text-right text-gray-500 text-xs font-semibold">
                                 {new Date(visit.visited_at).toLocaleString()}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
