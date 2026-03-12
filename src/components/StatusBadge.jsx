const config = {
    APPLIED: { label: 'Applied', bg: '#eff6ff', color: '#2563eb' },
    INTERVIEW: { label: 'Interview', bg: '#fefce8', color: '#ca8a04' },
    OFFER: { label: 'Offer', bg: '#f0fdf4', color: '#16a34a' },
    REJECTED: { label: 'Rejected', bg: '#fef2f2', color: '#dc2626' },
    WITHDRAWN: { label: 'Withdrawn', bg: '#f9fafb', color: '#6b7280' },
};

export default function StatusBadge({ status }) {
    const c = config[status] || config.APPLIED;
    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '500',
            background: c.bg,
            color: c.color,
        }}>
            {c.label}
        </span>
    );
}