import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, Box, LayoutDashboard, Settings, Map, 
  Bell, Search, Plus, Calendar, CheckCircle2, AlertTriangle, 
  Clock, TrendingUp, Filter, MoreHorizontal, X
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalVolunteers: 0, activeAllocations: 0, criticalNeeds: 0, responseTimeHours: 0 });
  const [allocations, setAllocations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Dropdown states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'danger', icon: '🔴', title: 'Urgent Request', message: 'Storm Relief Team requires 2 more medical personnel immediately at Zone 4.' },
    { id: 2, type: 'success', icon: '🟢', title: 'System Update', message: 'Database has been successfully synced with headquarters.' }
  ]);

  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/stats');
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);

      const allocationsRes = await fetch('http://localhost:5000/api/allocations');
      const allocationsData = await allocationsRes.json();
      if (allocationsData.success) setAllocations(allocationsData.data);

      const volunteersRes = await fetch('http://localhost:5000/api/volunteers');
      const volunteersData = await volunteersRes.json();
      if (volunteersData.success) setVolunteers(volunteersData.data);
    } catch (error) {
      console.error('Error fetching backend data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (modalType === 'allocation') {
      try {
        await fetch('http://localhost:5000/api/allocations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            location: data.location,
            type: data.type || 'info'
          })
        });
      } catch (err) {}
    } else if (modalType === 'volunteer') {
      try {
        await fetch('http://localhost:5000/api/volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            role: data.role,
            distance: '0.0km'
          })
        });
      } catch (err) {}
    }
    
    setIsModalOpen(false);
    fetchData(); // Refresh data
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Simulate updating backend profile
    alert('Personal details saved successfully! The coordinator profile is now updated.');
  };

  // Sort allocations by priority (danger > warning > info > success)
  const priorityWeight = { danger: 1, warning: 2, info: 3, success: 4 };
  const sortedAllocations = [...allocations].sort((a, b) => {
    const weightA = priorityWeight[a.type] || 5;
    const weightB = priorityWeight[b.type] || 5;
    return weightA - weightB;
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading System Data...</div>;
  }

  return (
    <div className="app-container" onClick={() => {}}>
      {/* Sidebar */}
      <aside className="sidebar glass" onClick={() => { setIsNotificationsOpen(false); setIsProfileOpen(false); }}>
        <div className="sidebar-logo">
          <div className="icon"><Map size={24} /></div>
          <span className="text-gradient">SmartAlloc</span>
        </div>

        <nav style={{ flex: 1 }}>
          <div className="nav-group-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</div>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'volunteers' ? 'active' : ''}`} onClick={() => setActiveTab('volunteers')}>
            <Users size={20} /> Volunteers
          </div>
          <div className={`nav-item ${activeTab === 'allocations' ? 'active' : ''}`} onClick={() => setActiveTab('allocations')}>
            <Box size={20} /> Allocations
          </div>
        </nav>

        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={20} /> Settings
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ position: 'relative' }}>
        {/* Header */}
        <header className="header">
          <div onClick={() => { setIsNotificationsOpen(false); setIsProfileOpen(false); }}>
            <h1 className="title">
              {activeTab === 'dashboard' && <>Resource <span className="text-gradient">Dashboard</span></>}
              {activeTab === 'volunteers' && <>Manage <span className="text-gradient">Volunteers</span></>}
              {activeTab === 'allocations' && <>Active <span className="text-gradient">Allocations</span></>}
              {activeTab === 'settings' && <>System <span className="text-gradient">Settings</span></>}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {activeTab === 'dashboard' && "Welcome back, Coordinator. Here is your overview today."}
              {activeTab === 'volunteers' && "View and manage all available personnel."}
              {activeTab === 'allocations' && "Track and deploy resources across zones."}
              {activeTab === 'settings' && "Configure system preferences and advanced options."}
            </p>
          </div>
          <div className="header-actions">
            <div className="icon-btn" onClick={() => { setIsNotificationsOpen(false); setIsProfileOpen(false); alert('Search modal coming soon!'); }}>
              <Search size={20} />
            </div>
            
            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <div className="icon-btn" style={{ position: 'relative' }} onClick={(e) => { e.stopPropagation(); setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}>
                <Bell size={20} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg-surface)' }}></span>}
              </div>
              {isNotificationsOpen && (
                <div className="glass-card" style={{ position: 'absolute', top: '55px', right: 0, width: '350px', zIndex: 50, padding: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0 }}>Notifications</h4>
                      {notifications.length > 0 && <span className="badge badge-danger">{notifications.length} New</span>}
                    </div>
                    {notifications.length > 0 && (
                      <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem', border: 'none' }} onClick={(e) => { e.stopPropagation(); setNotifications([]); }}>
                        Clear All
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '1rem 0' }}>No new notifications</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} style={{ background: `rgba(${notif.type === 'danger' ? '239, 68, 68' : '16, 185, 129'}, 0.1)`, padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, paddingRight: '8px' }}>
                            <strong style={{ color: `var(--${notif.type})`, display: 'block', marginBottom: '4px' }}>{notif.icon} {notif.title}</strong>
                            {notif.message}
                          </div>
                          <button 
                            className="icon-btn" 
                            style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} 
                            title="Mark as done"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setNotifications(notifications.filter(n => n.id !== notif.id)); 
                            }}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <img 
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                alt="Profile" 
                className="avatar" 
                style={{ cursor: 'pointer', border: isProfileOpen ? '2px solid var(--primary)' : '2px solid var(--border)' }} 
                onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }} 
              />
              {isProfileOpen && (
                <div className="glass-card" style={{ position: 'absolute', top: '55px', right: 0, width: '220px', zIndex: 50, padding: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                   <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                     <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="avatar" style={{ width: 64, height: 64, margin: '0 auto', marginBottom: '0.5rem' }} />
                     <h4 style={{ margin: 0 }}>Coordinator</h4>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>admin@smartalloc.org</p>
                   </div>
                   <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }} onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}>
                       <Settings size={14} style={{ marginRight: '6px' }} /> Account Settings
                     </button>
                     <button className="btn btn-outline" style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger-bg)', justifyContent: 'center', fontSize: '0.8rem' }} onClick={() => alert('Logging Out...')}>
                       Log Out
                     </button>
                   </div>
                </div>
              )}
            </div>

            <button className="btn btn-primary" onClick={() => { setModalType('allocation'); setIsModalOpen(true); setIsNotificationsOpen(false); setIsProfileOpen(false); }}>
              <Plus size={18} /> New Allocation
            </button>
          </div>
        </header>

        <div onClick={() => { setIsNotificationsOpen(false); setIsProfileOpen(false); }}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <section className="stats-grid">
                <div className="glass-card stat-card" onClick={() => setActiveTab('volunteers')} style={{ cursor: 'pointer' }}>
                  <div className="stat-header">
                    <span>Total Volunteers</span>
                    <div className="stat-icon primary"><Users size={20} /></div>
                  </div>
                  <div className="stat-value">{stats.totalVolunteers}</div>
                  <div className="stat-footer stat-trend up">
                    <TrendingUp size={14} /> <span>Live synced</span>
                  </div>
                </div>
                
                <div className="glass-card stat-card" onClick={() => setActiveTab('allocations')} style={{ cursor: 'pointer' }}>
                  <div className="stat-header">
                    <span>Active Allocations</span>
                    <div className="stat-icon success"><Box size={20} /></div>
                  </div>
                  <div className="stat-value">{stats.activeAllocations}</div>
                  <div className="stat-footer stat-trend up">
                    <TrendingUp size={14} /> <span>Across all zones</span>
                  </div>
                </div>

                <div className="glass-card stat-card">
                  <div className="stat-header">
                    <span>Critical Needs</span>
                    <div className="stat-icon danger"><AlertTriangle size={20} /></div>
                  </div>
                  <div className="stat-value">{stats.criticalNeeds}</div>
                  <div className="stat-footer stat-trend down">
                    <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> <span>Requires attention</span>
                  </div>
                </div>

                <div className="glass-card stat-card">
                  <div className="stat-header">
                    <span>Response Time</span>
                    <div className="stat-icon warning"><Clock size={20} /></div>
                  </div>
                  <div className="stat-value">{stats.responseTimeHours}h</div>
                  <div className="stat-footer stat-trend up">
                    <TrendingUp size={14} /> <span>Faster than average</span>
                  </div>
                </div>
              </section>

              <section className="dashboard-content">
                {/* Active Tasks List */}
                <div className="glass-card">
                  <div className="card-header">
                    <h2 className="card-title">Priority Allocations</h2>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('allocations')}>
                      View All
                    </button>
                  </div>
                  <div className="task-list">
                    {sortedAllocations.slice(0, 4).map(task => (
                      <div key={task.id} className="task-item">
                        <div className="task-info">
                          <div className="icon-box" style={{ backgroundColor: `var(--${task.type}-bg)`, color: `var(--${task.type})` }}>
                            {task.type === 'danger' ? <AlertTriangle size={20}/> : <Box size={20}/>}
                          </div>
                          <div className="task-details">
                            <h4>{task.title}</h4>
                            <p>{task.location} • {task.time}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
                          <span className={`badge badge-${task.type}`}>{task.status}</span>
                          <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${task.progress}%`, backgroundColor: `var(--${task.type})` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Volunteers List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-card">
                    <div className="card-header">
                      <h2 className="card-title">Available Volunteers</h2>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setModalType('volunteer'); setIsModalOpen(true); }}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    <div className="task-list">
                      {volunteers.slice(0, 4).map((vol, index) => (
                        <div key={vol.id} className="task-item" style={{ padding: '8px' }}>
                          <div className="task-info">
                            <img src={`https://i.pravatar.cc/150?u=${vol.id}`} alt={vol.name} className="avatar" style={{ width: 32, height: 32 }} />
                            <div className="task-details">
                              <h4>{vol.name}</h4>
                              <p>{vol.role} • {vol.distance} away</p>
                            </div>
                          </div>
                          <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => alert(`Assigned ${vol.name} to urgent task!`)}>
                            <CheckCircle2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setActiveTab('volunteers')}>View All Volunteers</button>
                  </div>
                  
                  <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none' }}>
                     <h3 style={{ color: 'white', marginBottom: '8px' }}>Need assistance?</h3>
                     <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '16px' }}>Our AI can auto-recommend the best resource allocations.</p>
                     <button className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%' }} onClick={() => alert('Running AI Allocation Engine... (Demo)')}>
                       Run Auto-Allocator
                     </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Volunteers Tab */}
          {activeTab === 'volunteers' && (
            <div className="glass-card" style={{ flex: 1, minHeight: '500px' }}>
              <div className="card-header">
                 <h2 className="card-title">All Registered Volunteers</h2>
                 <button className="btn btn-primary" onClick={() => { setModalType('volunteer'); setIsModalOpen(true); }}><Plus size={16}/> Add Volunteer</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {volunteers.map(vol => (
                  <div key={vol.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                    <img src={`https://i.pravatar.cc/150?u=${vol.id}`} alt={vol.name} className="avatar" style={{ width: 64, height: 64 }} />
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{vol.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{vol.role}</p>
                      <span className={`badge ${vol.status === 'available' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '8px', display: 'inline-block' }}>{vol.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allocations Tab */}
          {activeTab === 'allocations' && (
            <div className="glass-card" style={{ flex: 1, minHeight: '500px' }}>
              <div className="card-header">
                 <h2 className="card-title">All Project Allocations</h2>
                 <button className="btn btn-primary" onClick={() => { setModalType('allocation'); setIsModalOpen(true); }}><Plus size={16}/> New Allocation</button>
              </div>
              <div className="task-list">
                {sortedAllocations.map(task => (
                  <div key={task.id} className="task-item" style={{ padding: '16px' }}>
                    <div className="task-info">
                      <div className="icon-box" style={{ backgroundColor: `var(--${task.type}-bg)`, color: `var(--${task.type})` }}>
                        {task.type === 'danger' ? <AlertTriangle size={24}/> : <Box size={24}/>}
                      </div>
                      <div className="task-details">
                        <h4 style={{ fontSize: '1.1rem' }}>{task.title}</h4>
                        <p>{task.location} • Started {task.time}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ width: '150px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="progress-container" style={{ marginTop: 0 }}>
                          <div className="progress-bar" style={{ width: `${task.progress}%`, backgroundColor: `var(--${task.type})` }}></div>
                        </div>
                      </div>
                      <span className={`badge badge-${task.type}`} style={{ width: '100px', textAlign: 'center' }}>{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="dashboard-content" style={{ gridTemplateColumns: '1fr', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
              
              {/* Personal Information Setup */}
              <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="avatar" style={{ width: 80, height: 80, border: '3px solid var(--primary)' }} />
                  <div>
                    <h2 className="card-title" style={{ fontSize: '1.4rem' }}>Personal Information</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Update your photo and personal coordinator details here.</p>
                  </div>
                </div>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleProfileUpdate}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                      <input name="coordinatorName" required type="text" defaultValue="Coordinator Admin" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                      <input name="coordinatorEmail" required type="email" defaultValue="admin@smartalloc.org" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                      <input name="coordinatorPhone" type="tel" defaultValue="+1 (555) 123-4567" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role / Title</label>
                      <input name="coordinatorRole" type="text" defaultValue="Chief Operations Coordinator" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => alert('Changes reverted.')}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>

              {/* System Preferences */}
              <div className="glass-card">
                <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>System Preferences</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>Dark Mode</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Toggle the dark theme for the interface.</p>
                    </div>
                    <div style={{ width: '44px', height: '24px', background: 'var(--primary)', borderRadius: '24px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>Push Notifications</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receive browser alerts for urgent allocations.</p>
                    </div>
                    <div style={{ width: '44px', height: '24px', background: 'var(--primary)', borderRadius: '24px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>Auto-Allocation AI</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Allow AI to assign matching volunteers automatically.</p>
                    </div>
                    <div style={{ width: '44px', height: '24px', background: 'var(--border)', borderRadius: '24px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', left: '2px', top: '2px', width: '20px', height: '20px', background: 'var(--text-secondary)', borderRadius: '50%' }}></div>
                    </div>
                  </div>
                  
                  <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)', alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={() => alert('Settings reset!')}>Reset All Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simple Modal Overlay */}
        {isModalOpen && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            <div className="glass-card" style={{ width: '400px', padding: '2rem', maxWidth: '90%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>{modalType === 'allocation' ? 'Create New Allocation' : 'Add New Volunteer'}</h2>
                <button className="icon-btn" onClick={() => setIsModalOpen(false)} style={{ border: 'none' }}><X size={20}/></button>
              </div>
              
              <form onSubmit={handleNewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {modalType === 'allocation' ? (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
                      <input name="title" required type="text" placeholder="e.g. Flood Relief Team" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                      <input name="location" required type="text" placeholder="e.g. Riverside District" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority / Type</label>
                      <select name="type" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'white' }}>
                        <option value="success">Normal</option>
                        <option value="info">Moderate</option>
                        <option value="warning">High</option>
                        <option value="danger">Urgent / Critical</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                      <input name="name" required type="text" placeholder="e.g. Alex Johnson" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role / Expertise</label>
                      <input name="role" required type="text" placeholder="e.g. Medical, Driver, etc" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'white' }} />
                    </div>
                  </>
                )}
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
