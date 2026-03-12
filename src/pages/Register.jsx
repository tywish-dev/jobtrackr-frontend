import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirm: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({
        ...form, [e.target.name]: e.target.value
    });

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.email ||
                'Something went wrong'
            );
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
                        Your job search,<br />
                        finally organized.
                    </p>

                    <div style={styles.features}>
                        {[
                            ['📋', 'Track every application in one place'],
                            ['📊', 'Visualize your pipeline with real stats'],
                            ['🔍', 'Filter and search with ease'],
                            ['🚀', 'Stay on top of every opportunity'],
                        ].map(([icon, text]) => (
                            <div key={text} style={styles.feature}>
                                <span style={styles.featureIcon}>{icon}</span>
                                <span style={styles.featureText}>{text}</span>
                            </div>
                        ))}
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
                        <h2 style={styles.formTitle}>Create an account</h2>
                        <p style={styles.formSub}>
                            Start tracking your job search today
                        </p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={submit} style={styles.fields}>
                        <div style={styles.field}>
                            <label style={styles.label}>Full name</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="name"
                                placeholder="Samet Yılmaz"
                                value={form.name}
                                onChange={handle}
                                required
                            />
                        </div>

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

                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label style={styles.label}>Password</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handle}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Confirm password</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    name="confirm"
                                    placeholder="••••••••"
                                    value={form.confirm}
                                    onChange={handle}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password strength indicator */}
                        {form.password && (
                            <div style={styles.strength}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            ...styles.strengthBar,
                                            background: getStrengthColor(
                                                getStrength(form.password), i
                                            ),
                                        }}
                                    />
                                ))}
                                <span style={styles.strengthLabel}>
                                    {getStrengthLabel(getStrength(form.password))}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                ...styles.btn,
                                opacity: loading ? 0.7 : 1,
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account →'}
                        </button>
                    </form>

                    <p style={styles.switch}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Password strength helpers
function getStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9!@#$%^&*]/.test(password)) score++;
    return score;
}

function getStrengthColor(strength, bar) {
    if (bar > strength) return '#e5e7eb';
    if (strength === 1) return '#ef4444';
    if (strength === 2) return '#f59e0b';
    if (strength === 3) return '#84cc16';
    return '#1a6b4a';
}

function getStrengthLabel(strength) {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][strength] || '';
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
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '8px',
    },
    feature: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    featureIcon: {
        fontSize: '16px',
        width: '32px',
        height: '32px',
        background: '#1e4434',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: '14px',
        color: '#86a898',
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
        overflowY: 'auto',
    },
    form: {
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
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
        gap: '18px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
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
        width: '100%',
    },
    strength: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    strengthBar: {
        flex: 1,
        height: '3px',
        borderRadius: '2px',
        transition: 'background 0.2s',
    },
    strengthLabel: {
        fontSize: '12px',
        color: '#6b7280',
        minWidth: '40px',
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