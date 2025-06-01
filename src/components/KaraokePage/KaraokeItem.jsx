function KaraokeItem({ item, isAdmin, onToggleComplete, onDelete, isNextToPlay }) {
    const { username, title, artist, video_url, is_completed } = item;

    const copyVideoUrl = async () => {
        try {
            await navigator.clipboard.writeText(video_url);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <div
            className={`card mb-3 ${is_completed ? 'border-success' : 'border-secondary'} ${
                isNextToPlay ? 'border-warning border-3 shadow-lg' : ''
            }`}
            style={{
                opacity: is_completed ? 0.7 : 1,
                transition: 'all 0.3s ease',
                transform: isNextToPlay ? 'scale(1.02)' : 'scale(1)',
                backgroundColor: isNextToPlay ? '#fff8e1' : 'white'
            }}
        >
            <div className="card-body">
                {isNextToPlay && (
                    <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-warning text-dark fw-bold">
                            <i className="bi bi-play-fill me-1"></i>
                            UP NEXT
                        </span>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 className={`card-title mb-1 ${is_completed ? 'text-decoration-line-through text-muted' : ''}`}>
                            {title}
                        </h5>
                        {artist && (
                            <p className={`text-muted mb-2 ${is_completed ? 'text-decoration-line-through' : ''}`}>
                                by {artist}
                            </p>
                        )}
                    </div>
                    <span className={`badge ${is_completed ? 'bg-success' : 'bg-secondary'} ms-2`}>
                        {is_completed ? 'Completed' : 'Queued'}
                    </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-person-fill text-primary me-2"></i>
                    <span className="text-muted fw-semibold">{username}</span>
                </div>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-muted small">
                                {isNextToPlay ? (
                                    <span className="text-warning fw-bold">
                                        <i className="bi bi-arrow-right me-1"></i>
                                        Next to perform
                                    </span>
                                ) : (
                                    <span>In queue</span>
                                )}
                            </div>

                            <button
                                onClick={copyVideoUrl}
                                className="btn btn-outline-secondary btn-sm"
                                title="Copy video URL"
                            >
                                <i className="bi bi-clipboard me-1"></i>
                                Copy URL
                            </button>
                        </div>

                        {isAdmin && (
                            <div className="d-flex gap-2">
                                <button
                                    className={`btn btn-sm ${is_completed ? 'btn-warning' : 'btn-success'}`}
                                    onClick={onToggleComplete}
                                    title={is_completed ? 'Mark as Pending' : 'Mark as Completed'}
                                >
                                    <i className={`bi ${is_completed ? 'bi-arrow-counterclockwise' : 'bi-check-lg'} me-1`}></i>
                                    {is_completed ? 'Undo' : 'Complete'}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={onDelete}
                                    title="Delete Song"
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KaraokeItem;