import { useAuth } from '../context/AuthContext';

const nav = [
    { icon: '▦', label: 'Dashboard', id: 'dashboard' },
    { icon: '◈', label: 'Applications', id: 'applications' },
    { icon: '◎', label: 'Stats', id: 'stats' },
];

export default function Sidebar({ active, onNav }) {
    const { user, logout } = useAuth();

    return (
        <div style={styles.root}>
            {/* Logo */}
            <div style={styles.logo}>
                <span style={styles.logoIcon}>⬡</span>
                <span style={styles.logoText}>JobTrackr</span>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
                {nav.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNav(item.id)}
                        style={{
                            ...styles.navItem,
                            ...(active === item.id ? styles.navActive : {}),
                        }}
                    >
                        <span style={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom */}
            <div style={styles.bottom}>
                <div style={styles.user}>
                    <div style={styles.avatar}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>{user?.name}</span>
                        <span style={styles.userEmail}>{user?.email}</span>
                    </div>
                </div>
                <button onClick={logout} style={styles.logout}>
                    Sign out
                </button>
            </div>
        </div>
    );
}

const styles = {
    root: {
        width: '220px',
        minWidth: '220px',
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 8px',
        marginBottom: '32px',
    },
    logoIcon: {
        fontSize: '20px',
        color: '#1a6b4a',
    },
    logoText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '-0.3px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
        width: '100%',
    },
    navActive: {
        background: '#e8f5ef',
        color: '#1a6b4a',
        borderLeft: '3px solid #1a6b4a',
        paddingLeft: '9px',
    },
    navIcon: {
        fontSize: '16px',
        width: '20px',
        textAlign: 'center',
    },
    bottom: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#0f2d1f',
        color: '#4ade80',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600',
        flexShrink: 0,
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        overflow: 'hidden',
    },
    userName: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#1a1a1a',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    userEmail: {
        fontSize: '11px',
        color: '#9ca3af',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    logout: {
        background: 'none',
        border: '1px solid #e5e7eb',
        borderRadius: '7px',
        padding: '7px',
        fontSize: '13px',
        color: '#6b7280',
        cursor: 'pointer',
        width: '100%',
    },
};