import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ApplicationModal from '../components/ApplicationModal';

const COLORS = {
    APPLIED: '#2563eb',
    INTERVIEW: '#ca8a04',
    OFFER: '#16a34a',
    REJECTED: '#dc2626',
    WITHDRAWN: '#9ca3af',
};

export default function Dashboard() {
    const [view, setView] = useState('dashboard');
    const [apps, setApps] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | app object
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [appsRes, statsRes] = await Promise.all([
                api.get('/api/applications'),
                api.get('/api/applications/stats'),
            ]);
            setApps(appsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const saveApp = async (form) => {
        try {
            if (modal?.id) {
                await api.put(`/api/applications/${modal.id}`, form);
            } else {
                await api.post('/api/applications', form);
            }
            setModal(null);
            fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteApp = async (id) => {
        if (!window.confirm('Delete this application?')) return;
        await api.delete(`/api/applications/${id}`);
        fetchAll();
    };

    const filtered = apps.filter(a => {
        const matchStatus = filter ? a.status === filter : true;
        const matchSearch = search
            ? a.company.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase())
            : true;
        return matchStatus && matchSearch;
    });

    const pieData = stats
        ? Object.entries(stats.byStatus)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => ({ name: k, value: v }))
        : [];

    return (
        <div style={styles.root}>
            <Sidebar active={view} onNav={setView} />

            <main style={styles.main}>

                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.pageTitle}>
                            {view === 'dashboard' && 'Overview'}
                            {view === 'applications' && 'Applications'}
                            {view === 'stats' && 'Statistics'}
                        </h1>
                        <p style={styles.pageSub}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        style={styles.addBtn}
                        onClick={() => setModal('add')}
                    >
                        + Add application
                    </button>
                </div>

                {loading ? (
                    <div style={styles.empty}>Loading...</div>
                ) : (
                    <>
                        {/* DASHBOARD VIEW */}
                        {view === 'dashboard' && (
                            <div style={styles.content}>
                                {/* Stat Cards */}
                                <div style={styles.statsGrid}>
                                    <StatCard
                                        label="Total Applications"
                                        value={stats?.total ?? 0}
                                        sub="All time"
                                        accent
                                    />
                                    <StatCard
                                        label="In Interview"
                                        value={stats?.byStatus?.INTERVIEW ?? 0}
                                        sub="Active conversations"
                                    />
                                    <StatCard
                                        label="Offers"
                                        value={stats?.byStatus?.OFFER ?? 0}
                                        sub="Congratulations 🎉"
                                    />
                                    <StatCard
                                        label="Response Rate"
                                        value={`${stats?.responseRate ?? 0}%`}
                                        sub="Interview + Offer + Rejected"
                                    />
                                </div>

                                {/* Chart + Recent */}
                                <div style={styles.twoCol}>
                                    {/* Pie Chart */}
                                    <div style={styles.card}>
                                        <h3 style={styles.cardTitle}>Pipeline breakdown</h3>
                                        {pieData.length > 0 ? (
                                            <>
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={55}
                                                            outerRadius={85}
                                                            paddingAngle={3}
                                                            dataKey="value"
                                                        >
                                                            {pieData.map((entry) => (
                                                                <Cell
                                                                    key={entry.name}
                                                                    fill={COLORS[entry.name]}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(value, name) => [value, name]}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div style={styles.legend}>
                                                    {pieData.map(({ name, value }) => (
                                                        <div key={name} style={styles.legendItem}>
                                                            <div style={{
                                                                ...styles.legendDot,
                                                                background: COLORS[name]
                                                            }} />
                                                            <span style={styles.legendLabel}>{name}</span>
                                                            <span style={styles.legendVal}>{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div style={styles.empty}>
                                                No data yet — add your first application!
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Applications */}
                                    <div style={styles.card}>
                                        <h3 style={styles.cardTitle}>Recent applications</h3>
                                        {apps.length === 0 ? (
                                            <div style={styles.emptyState}>
                                                <p style={styles.emptyText}>No applications yet</p>
                                                <button
                                                    style={styles.emptyBtn}
                                                    onClick={() => setModal('add')}
                                                >
                                                    Add your first →
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={styles.recentList}>
                                                {apps.slice(0, 6).map(app => (
                                                    <div key={app.id} style={styles.recentItem}>
                                                        <div style={styles.recentLeft}>
                                                            <div style={styles.companyInitial}>
                                                                {app.company[0]}
                                                            </div>
                                                            <div>
                                                                <p style={styles.recentCompany}>
                                                                    {app.company}
                                                                </p>
                                                                <p style={styles.recentRole}>
                                                                    {app.role}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* APPLICATIONS VIEW */}
                        {view === 'applications' && (
                            <div style={styles.content}>
                                {/* Filters */}
                                <div style={styles.filters}>
                                    <input
                                        style={styles.search}
                                        placeholder="Search company or role..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                    <div style={styles.filterBtns}>
                                        {['', 'APPLIED', 'INTERVIEW', 'OFFER',
                                            'REJECTED', 'WITHDRAWN'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilter(s)}
                                                    style={{
                                                        ...styles.filterBtn,
                                                        ...(filter === s ? styles.filterActive : {}),
                                                    }}
                                                >
                                                    {s || 'All'}
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                {/* Table */}
                                <div style={styles.card}>
                                    {filtered.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <p style={styles.emptyText}>No applications found</p>
                                        </div>
                                    ) : (
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    {['Company', 'Role', 'Status',
                                                        'Applied', 'Salary', ''].map(h => (
                                                            <th key={h} style={styles.th}>{h}</th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map((app, i) => (
                                                    <tr
                                                        key={app.id}
                                                        style={{
                                                            ...styles.tr,
                                                            background: i % 2 === 0
                                                                ? '#ffffff' : '#fafaf9',
                                                        }}
                                                    >
                                                        <td style={styles.td}>
                                                            <div style={styles.companyCell}>
                                                                <div style={styles.companyInitial}>
                                                                    {app.company[0]}
                                                                </div>
                                                                <span style={{ fontWeight: '500' }}>
                                                                    {app.company}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <span style={{ color: '#6b7280' }}>
                                                                {app.role}
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <StatusBadge status={app.status} />
                                                        </td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                color: '#6b7280',
                                                                fontSize: '13px',
                                                                fontFamily: 'var(--mono)',
                                                            }}>
                                                                {app.appliedDate
                                                                    ? new Date(app.appliedDate)
                                                                        .toLocaleDateString('en-US', {
                                                                            month: 'short', day: 'numeric'
                                                                        })
                                                                    : '—'
                                                                }
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                color: '#6b7280',
                                                                fontSize: '13px',
                                                                fontFamily: 'var(--mono)',
                                                            }}>
                                                                {app.salaryMin
                                                                    ? `$${(app.salaryMin / 1000).toFixed(0)}k`
                                                                    : '—'
                                                                }
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <div style={styles.actions}>
                                                                <button
                                                                    style={styles.actionBtn}
                                                                    onClick={() => setModal(app)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    style={{
                                                                        ...styles.actionBtn,
                                                                        color: '#dc2626',
                                                                    }}
                                                                    onClick={() => deleteApp(app.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STATS VIEW */}
                        {view === 'stats' && (
                            <div style={styles.content}>
                                <div style={styles.statsGrid}>
                                    {Object.entries(stats?.byStatus || {}).map(
                                        ([status, count]) => (
                                            <StatCard
                                                key={status}
                                                label={status}
                                                value={count}
                                                sub={`${stats.total > 0
                                                    ? ((count / stats.total) * 100).toFixed(1)
                                                    : 0}% of total`}
                                            />
                                        )
                                    )}
                                </div>

                                <div style={styles.card}>
                                    <h3 style={styles.cardTitle}>Response rate</h3>
                                    <div style={styles.rateBar}>
                                        <div style={{
                                            ...styles.rateBarFill,
                                            width: `${stats?.responseRate ?? 0}%`,
                                        }} />
                                    </div>
                                    <p style={styles.rateLabel}>
                                        <span style={{
                                            fontFamily: 'var(--mono)',
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            color: '#1a6b4a',
                                        }}>
                                            {stats?.responseRate ?? 0}%
                                        </span>
                                        {' '}of applications received a response
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modal */}
            {modal && (
                <ApplicationModal
                    initial={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                    onSave={saveApp}
                />
            )}
        </div>
    );
}

const styles = {
    root: {
        display: 'flex',
        height: '100vh',
        background: '#FAFAF9',
        overflow: 'hidden',
    },
    main: {
        flex: 1,
        overflowY: 'auto',
        padding: '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '-0.5px',
    },
    pageSub: {
        fontSize: '13px',
        color: '#9ca3af',
        marginTop: '4px',
    },
    addBtn: {
        padding: '10px 18px',
        background: '#1a6b4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
    },
    twoCol: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
    },
    cardTitle: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px',
        letterSpacing: '-0.2px',
    },
    legend: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '16px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    legendDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    legendLabel: {
        fontSize: '13px',
        color: '#6b7280',
        flex: 1,
    },
    legendVal: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#1a1a1a',
        fontFamily: 'var(--mono)',
    },
    recentList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    recentItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #f3f4f6',
    },
    recentLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    companyInitial: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        flexShrink: 0,
    },
    recentCompany: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1a1a1a',
    },
    recentRole: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '2px',
    },
    filters: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    search: {
        padding: '9px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        background: '#ffffff',
        width: '240px',
    },
    filterBtns: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
    },
    filterBtn: {
        padding: '7px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: '999px',
        fontSize: '13px',
        background: '#ffffff',
        color: '#6b7280',
        cursor: 'pointer',
    },
    filterActive: {
        background: '#0f2d1f',
        color: '#4ade80',
        borderColor: '#0f2d1f',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '10px 16px',
        fontSize: '12px',
        fontWeight: '500',
        color: '#9ca3af',
        borderBottom: '1px solid #f3f4f6',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    tr: {
        transition: 'background 0.1s',
    },
    td: {
        padding: '14px 16px',
        fontSize: '14px',
        color: '#1a1a1a',
        borderBottom: '1px solid #f9fafb',
    },
    companyCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        fontSize: '13px',
        color: '#6b7280',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '6px',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '40px 0',
    },
    emptyText: {
        fontSize: '14px',
        color: '#9ca3af',
    },
    emptyBtn: {
        padding: '8px 16px',
        background: '#1a6b4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#9ca3af',
        fontSize: '14px',
    },
    rateBar: {
        height: '8px',
        background: '#f3f4f6',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '16px',
    },
    rateBarFill: {
        height: '100%',
        background: '#1a6b4a',
        borderRadius: '999px',
        transition: 'width 0.5s ease',
    },
    rateLabel: {
        fontSize: '14px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
};