// Initial mock data for the application
export const db = {
  stats: {
    totalVolunteers: 2845,
    activeAllocations: 142,
    criticalNeeds: 8,
    responseTimeHours: 1.4
  },
  volunteers: [
    { id: 1, name: 'Sarah Jenkins', role: 'Medical Ops', distance: '1.2km', status: 'available' },
    { id: 2, name: 'David Chen', role: 'Logistics', distance: '3.4km', status: 'available' },
    { id: 3, name: 'Maria Garcia', role: 'Field Lead', distance: '4.1km', status: 'deployed' },
    { id: 4, name: 'James Wilson', role: 'Support', distance: '5.0km', status: 'available' }
  ],
  allocations: [
    { id: 1, title: 'Medical Supply Distribution', location: 'North District Zone A', status: 'In Progress', type: 'info', progress: 65, time: '2 hrs ago' },
    { id: 2, title: 'Storm Relief Team Deployment', location: 'Coastal Region Area 4', status: 'Urgent', type: 'danger', progress: 30, time: '30 mins ago' },
    { id: 3, title: 'Community Kitchen Staffing', location: 'City Center South', status: 'Completed', type: 'success', progress: 100, time: '5 hrs ago' },
    { id: 4, title: 'Transport Dispatch coordination', location: 'Logistics Hub B', status: 'Pending', type: 'warning', progress: 10, time: '1 hr ago' }
  ]
};
