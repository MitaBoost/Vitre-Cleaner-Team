import React from 'react';
import { Room } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText } from 'lucide-react';

interface StatsProps {
  rooms: Room[];
}

const Stats: React.FC<StatsProps> = ({ rooms }) => {
  // Calculate Stats
  const total = rooms.length;
  const done = rooms.filter(r => r.status === 'Done').length;
  const inProgress = rooms.filter(r => r.status === 'In Progress').length;
  const notCleaned = total - done - inProgress;

  const userPerformance: Record<string, number> = {};
  rooms.forEach(r => {
    if (r.status === 'Done' && r.assignedTo) {
      userPerformance[r.assignedTo] = (userPerformance[r.assignedTo] || 0) + 1;
    }
  });

  const barData = Object.keys(userPerformance).map(user => ({
    name: user,
    cleaned: userPerformance[user]
  }));

  const pieData = [
    { name: 'Done', value: done, color: '#22c55e' },
    { name: 'Progress', value: inProgress, color: '#fb923c' },
    { name: 'To Do', value: notCleaned, color: '#ef4444' },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Daily Cleaning Report - ${new Date().toLocaleDateString()}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Total Rooms: ${total} | Cleaned: ${done}`, 14, 32);

    const tableData = rooms.map(r => [
        r.number,
        r.priority,
        r.status,
        r.assignedTo || '-',
        r.startedAt ? new Date(r.startedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        r.completedAt ? new Date(r.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        r.completedAt && r.startedAt ? `${Math.round((r.completedAt - r.startedAt) / 60000)}m` : '-'
    ]);

    autoTable(doc, {
      head: [['Room', 'Priority', 'Status', 'User', 'Start', 'End', 'Duration']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 }
    });

    doc.save(`vitre_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase">Cleaned</p>
          <p className="text-2xl font-extrabold text-green-500">{done}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
           <p className="text-slate-500 text-xs font-bold uppercase">Pending</p>
           <p className="text-2xl font-extrabold text-red-500">{notCleaned}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
           <p className="text-slate-500 text-xs font-bold uppercase">Progress</p>
           <p className="text-2xl font-extrabold text-orange-400">{inProgress}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Team Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="cleaned" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981'][index % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <h3 className="text-lg font-bold text-slate-800 mb-4">Status Overview</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={pieData} 
                        dataKey="value" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center space-x-4 mt-2">
             {pieData.map(d => (
                 <div key={d.name} className="flex items-center text-xs font-medium text-slate-600">
                     <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: d.color }}></div>
                     {d.name}
                 </div>
             ))}
         </div>
      </div>

      {/* Actions */}
      <button 
        onClick={generatePDF}
        className="w-full flex items-center justify-center py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 active:scale-95 transition-all"
      >
        <Download size={20} className="mr-2" />
        Download Daily Report (PDF)
      </button>

      <div className="text-center text-xs text-slate-400 pt-4">
         <FileText className="inline-block w-4 h-4 mb-1" />
         <p>Reports reset automatically daily or manually by Admin.</p>
      </div>
    </div>
  );
};

export default Stats;