import cookieUtils from "../../utils/cookieUtils.js";

function AdminControls({ isAdmin, setIsAdmin, setShowAdminLogin, code }) {
    return (
        <div className="d-flex gap-2 flex-wrap">
            {!isAdmin && (
                <button className="btn btn-warning" onClick={() => setShowAdminLogin(true)}>
                    <i className="bi bi-key me-2"></i>Admin Login
                </button>
            )}
            {isAdmin && (
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success d-flex align-items-center">
                        <i className="bi bi-shield-check me-1"></i>Admin Access
                    </span>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                            setIsAdmin(false);
                            cookieUtils.delete(`karaokeAdmin_${code}`);
                        }}
                        title="Logout from admin"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminControls;