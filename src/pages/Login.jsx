import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({
        ...form, [e.target.name]: e.target.value
    });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(form.email, form.password);
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.root}>

            {/* Left Panel */}
            <div style={styles.left}>
                <div style={styles.leftContent}>
                    <div style={styles.logo}>⬡</div>
                    <h1 style={styles.brand}>JobTrackr</h1>
                    <p style={styles.tagline}>
                        Track every application.<br />
                        Land your next role.
                    </p>
                    <div style={styles.stats}>
                        <div style={styles.stat}>
                            <span style={styles.statNum}>30+</span>
                            <span style={styles.statLabel}>Applications tracked</span>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.stat}>
                            <span style={styles.statNum}>5</span>
                            <span style={styles.statLabel}>Status stages</span>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.stat}>
                            <span style={styles.statNum}>1</span>
                            <span style={styles.statLabel}>Dashboard to rule them all</span>
                        </div>
                    </div>
                </div>
                <p style={styles.leftFooter}>
                    Built by Samet Yılmaz · Open Source
                </p>
            </div>

            {/* Right Panel */}
            <div style={styles.right}>
                <div style={styles.form}>
                    <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Welcome back</h2>
                        <p style={styles.formSub}>
                            Sign in to your account to continue
                        </p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={submit} style={styles.fields}>
                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input
                                style={styles.input}
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handle}
                                required
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handle}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.btn,
                                opacity: loading ? 0.7 : 1,
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in →'}
                        </button>
                    </form>

                    <p style={styles.switch}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    root: {
        display: 'flex',
        height: '100vh',
        fontFamily: 'var(--font)',
    },

    // Left
    left: {
        width: '45%',
        background: '#0f2d1f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
    },
    leftContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        marginTop: '48px',
    },
    logo: {
        fontSize: '32px',
        color: '#4ade80',
    },
    brand: {
        fontSize: '36px',
        fontWeight: '600',
        color: '#ffffff',
        letterSpacing: '-0.5px',
    },
    tagline: {
        fontSize: '18px',
        color: '#86a898',
        lineHeight: '1.7',
        fontWeight: '300',
    },
    stats: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        marginTop: '16px',
    },
    stat: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    statNum: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#4ade80',
        fontFamily: 'var(--mono)',
    },
    statLabel: {
        fontSize: '12px',
        color: '#86a898',
        maxWidth: '80px',
        lineHeight: '1.4',
    },
    statDivider: {
        width: '1px',
        height: '40px',
        background: '#1e4434',
    },
    leftFooter: {
        fontSize: '12px',
        color: '#3d6b52',
    },

    // Right
    right: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAF9',
        padding: '48px',
    },
    form: {
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    formHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    formTitle: {
        fontSize: '26px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '-0.3px',
    },
    formSub: {
        fontSize: '14px',
        color: '#6b7280',
    },
    error: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        padding: '11px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#1a1a1a',
        background: '#ffffff',
        outline: 'none',
        transition: 'border-color 0.15s',
    },
    btn: {
        padding: '12px',
        background: '#1a6b4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '4px',
        transition: 'background 0.15s',
    },
    switch: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#6b7280',
    },
    link: {
        color: '#1a6b4a',
        textDecoration: 'none',
        fontWeight: '500',
    },
};