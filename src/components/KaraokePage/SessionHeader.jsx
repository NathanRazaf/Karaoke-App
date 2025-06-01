// Header component
function SessionHeader({ session, code, username, navigate }) {
    const { title, created_at, expires_at, items = [] } = session;
    const completedCount = items.filter(item => item.is_completed).length;
    const totalCount = items.length;

    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (error) {
            console.log(error);
            return 'Invalid Date';
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h1 className="card-title h2 mb-2">{title}</h1>
                        <p className="text-muted mb-1">
                            <i className="bi bi-calendar me-2"></i>Started: {formatDate(created_at)}
                        </p>
                        <p className="text-muted mb-0">
                            <i className="bi bi-clock me-2"></i>Expires: {formatDate(expires_at)}
                        </p>
                    </div>
                    <div className="text-end">
                        <span className="badge bg-primary fs-6 mb-2">Code: {code}</span>
                        <div className="text-muted">{completedCount} / {totalCount} completed</div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-person-fill text-primary"></i>
                        <span className="fw-semibold">Logged in as: </span>
                        <span className="text-primary">{username || 'Not set'}</span>
                        {!username && (
                            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => navigate('/')}>
                                Set Username
                            </button>
                        )}
                        {username && (
                            <small className="text-muted ms-2">(Go to home page to change)</small>
                        )}
                    </div>
                </div>

                <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                        className="progress-bar bg-success"
                        style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default SessionHeader;