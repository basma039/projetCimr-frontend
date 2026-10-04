export default function StatCard({ title, value }) {

    return (
        <div className="stat-card">

            <span className="stat-title">
                {title}
            </span>

            <strong className="stat-value">
                {value}
            </strong>

        </div>
    );
}