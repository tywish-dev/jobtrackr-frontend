export default function StatCard({ label, value, sub, accent }) {
    return (
        <div style={{
            background: accent ? '#0f2d1f' : '#ffffff',
            border: '1px solid',
            borderColor: accent ? 'transparent' : '#e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}>
            <span style={{
                fontSize: '13px',
                color: accent ? '#86a898' : '#6b7280',
                fontWeight: '500',
            }}>
                {label}
            </span>
            <span style={{
                fontSize: '32px',
                fontWeight: '600',
                color: accent ? '#4ade80' : '#1a1a1a',
                fontFamily: 'var(--mono)',
                letterSpacing: '-1px',
            }}>
                {value}
            </span>
            {sub && (
                <span style={{
                    fontSize: '12px',
                    color: accent ? '#3d6b52' : '#9ca3af',
                }}>
                    {sub}
                </span>
            )}
        </div>
    );
}