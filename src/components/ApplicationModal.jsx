import { useState, useEffect } from 'react';
import api from '../api/axios';

const STATUSES = [
    'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'
];

export default function ApplicationModal({ onClose, onSave, initial }) {
    const [form, setForm] = useState({
        company: '',
        role: '',
        status: 'APPLIED',
        jobUrl: '',
        notes: '',
        salaryMin: '',
        salaryMax: '',
        appliedDate: new Date().toISOString().split('T')[0],
        ...initial,
    });

    const handle = (e) => setForm({
        ...form, [e.target.name]: e.target.value
    });

    const submit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
            salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        });
    };

    // Close on Escape
    useEffect(() => {
        const handler = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const [extracting, setExtracting] = useState(false);
    const [extractError, setExtractError] = useState('');

    const extractFromUrl = async () => {
        if (!form.jobUrl) {
            setExtractError('Please enter a job URL first');
            return;
        }
        setExtracting(true);
        setExtractError('');
        try {
            const res = await api.post('/api/jobs/extract', {
                url: form.jobUrl
            });
            const data = res.data;
            setForm(prev => ({
                ...prev,
                company: data.company || prev.company,
                role: data.role || prev.role,
                salaryMin: data.salaryMin || prev.salaryMin,
                salaryMax: data.salaryMax || prev.salaryMax,
                notes: data.notes || prev.notes,
            }));
        } catch {
            setExtractError('Could not extract data from this URL');
        } finally {
            setExtracting(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div
                style={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <h3 style={styles.title}>
                        {initial ? 'Edit application' : 'Add application'}
                    </h3>
                    <button onClick={onClose} style={styles.close}>✕</button>
                </div>

                <form onSubmit={submit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Company *</label>
                            <input
                                style={styles.input}
                                name="company"
                                placeholder="Google"
                                value={form.company}
                                onChange={handle}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Role *</label>
                            <input
                                style={styles.input}
                                name="role"
                                placeholder="Software Engineer"
                                value={form.role}
                                onChange={handle}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Status</label>
                            <select
                                style={styles.input}
                                name="status"
                                value={form.status}
                                onChange={handle}
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Applied date</label>
                            <input
                                style={styles.input}
                                type="date"
                                name="appliedDate"
                                value={form.appliedDate}
                                onChange={handle}
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Job URL</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                style={{ ...styles.input, flex: 1 }}
                                name="jobUrl"
                                placeholder="https://careers.google.com/..."
                                value={form.jobUrl}
                                onChange={handle}
                            />
                            <button
                                type="button"
                                onClick={extractFromUrl}
                                disabled={extracting}
                                style={{
                                    padding: '10px 14px',
                                    background: extracting ? '#f3f4f6' : '#0f2d1f',
                                    color: extracting ? '#9ca3af' : '#4ade80',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: extracting ? 'not-allowed' : 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {extracting ? 'Extracting...' : '✦ Auto-fill'}
                            </button>
                        </div>
                        {extractError && (
                            <span style={{ fontSize: '12px', color: '#dc2626' }}>
                                {extractError}
                            </span>
                        )}
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Salary min ($)</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="salaryMin"
                                placeholder="80,000"
                                value={form.salaryMin}
                                onChange={handle}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Salary max ($)</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="salaryMax"
                                placeholder="120,000"
                                value={form.salaryMax}
                                onChange={handle}
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Notes</label>
                        <textarea
                            style={{ ...styles.input, resize: 'vertical', minHeight: '80px' }}
                            name="notes"
                            placeholder="Referral from John, applied via LinkedIn..."
                            value={form.notes}
                            onChange={handle}
                        />
                    </div>

                    <div style={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" style={styles.save}>
                            {initial ? 'Save changes' : 'Add application'} →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(2px)',
    },
    modal: {
        background: '#ffffff',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '-0.3px',
    },
    close: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '4px 8px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
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
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#1a1a1a',
        background: '#ffffff',
        outline: 'none',
        width: '100%',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '8px',
    },
    cancel: {
        padding: '10px 18px',
        background: 'none',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280',
        cursor: 'pointer',
    },
    save: {
        padding: '10px 18px',
        background: '#1a6b4a',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        cursor: 'pointer',
    },
};