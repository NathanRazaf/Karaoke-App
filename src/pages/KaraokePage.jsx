import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KaraokeItem from '../components/KaraokePage/KaraokeItem.jsx';
import { getSessionByCode } from "../api/karaokeRoutes.js";
import { createKaraokeItem, deleteKaraokeItem, toggleKaraokeItemCompletion } from "../api/karaokeItemRoutes.js";
import { ApiError } from "../api/api.js";
import SessionHeader from "../components/KaraokePage/SessionHeader.jsx";
import AddSongForm from "../components/KaraokePage/AddSongForm.jsx";

// Cookie utilities
const cookieUtils = {
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    set: (name, value, days = 30) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    delete: (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Admin controls component
function AdminControls({ isAdmin, setIsAdmin, setShowAdminLogin, code }) {
    return (
        <div className="d-flex gap-2 flex-wrap">
            {!isAdmin && (
                <button className="btn btn-outline-warning" onClick={() => setShowAdminLogin(true)}>
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


// Alert component for non-critical errors
function ErrorAlert({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {message}
            <button type="button" className="btn-close" onClick={onDismiss}></button>
        </div>
    );
}

function KaraokePage() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [karaokeSession, setKaraokeSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [criticalError, setCriticalError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const [showCompletedSongs, setShowCompletedSongs] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', artist: '' });

    const username = cookieUtils.get('karaokeUsername');

    // Load admin status and check username
    useEffect(() => {
        if (!username) {
            setCriticalError('Please set your username on the home page first');
            return;
        }
        const wasAdmin = cookieUtils.get(`karaokeAdmin_${code}`);
        if (wasAdmin === 'true') setIsAdmin(true);
    }, [code, username]);

    // Fetch session data
    const fetchData = async (silentUpdate = false) => {
        if (!silentUpdate) setLoading(true);
        try {
            const response = await getSessionByCode(code);
            if (!response.data) {
                setCriticalError('Karaoke session not found');
                return;
            }
            setKaraokeSession(prevSession => {
                if (!prevSession || JSON.stringify(prevSession) !== JSON.stringify(response.data)) {
                    return response.data;
                }
                return prevSession;
            });
        } catch (err) {
            if (!silentUpdate) {
                setCriticalError(err instanceof ApiError ? err.message : 'An unexpected error occurred');
            }
        } finally {
            if (!silentUpdate) setLoading(false);
        }
    };

    useEffect(() => {
        if (code && username) fetchData();
    }, [code, username]);

    useEffect(() => {
        const interval = setInterval(() => fetchData(true), 15000);
        return () => clearInterval(interval);
    }, [code]);

    // Handlers
    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (!adminPassword.trim()) {
            setAdminError('Please enter the admin password');
            return;
        }
        if (karaokeSession && adminPassword.trim() === karaokeSession.admin_password) {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setAdminError('');
            setAdminPassword('');
            cookieUtils.set(`karaokeAdmin_${code}`, 'true', 30);
        } else {
            setAdminError('Incorrect admin password');
        }
    };

    const handleAddItem = async () => {
        if (!newItem.title) return;
        try {
            await createKaraokeItem(
                karaokeSession._id,
                username || 'Anonymous',
                newItem.title,
                newItem.artist
            );
            await fetchData();
            setNewItem({ title: '', artist: '' });
            setShowAddForm(false);
        } catch (err) {
            console.log(err);
            setAlertMessage('Failed to add song. Please try again.');
        }
    };

    const handleToggleComplete = async (itemId) => {
        if (!isAdmin) return;
        try {
            await toggleKaraokeItemCompletion(karaokeSession._id, itemId);
            setKaraokeSession(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, is_completed: !item.is_completed } : item
                )
            }));
        } catch (err) {
            console.log(err);
            setAlertMessage('Failed to update song status. Please try again.');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!isAdmin) return;
        try {
            await deleteKaraokeItem(karaokeSession._id, itemId);
            setKaraokeSession(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== itemId)
            }));
        } catch (err) {
            console.log(err);
            setAlertMessage('Failed to delete song. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (criticalError) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="alert alert-danger text-center">
                    <h4>Error</h4>
                    <p>{criticalError}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const { items = [] } = karaokeSession || {};
    const completedCount = items.filter(item => item.is_completed).length;
    const filteredItems = showCompletedSongs ? items : items.filter(item => !item.is_completed);

    // Find the next song to play (first incomplete song)
    const nextSongIndex = items.findIndex(item => !item.is_completed);

    return (
        <div className="min-vh-100 py-4">
            <div className="container">
                <div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                            <i className="bi bi-house me-2"></i>Back to Home
                        </button>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col">
                        <SessionHeader session={karaokeSession} code={code} username={username} navigate={navigate} />
                        <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                                        <i className="bi bi-plus-circle me-2"></i>Add Song
                                    </button>
                                </div>
                                <AdminControls isAdmin={isAdmin} setIsAdmin={setIsAdmin} setShowAdminLogin={setShowAdminLogin} code={code} />
                            </div>
                        </div>
                    </div>
                </div>

                <ErrorAlert message={alertMessage} onDismiss={() => setAlertMessage('')} />

                {showAdminLogin && (
                    <div className="row mb-4">
                        <div className="col">
                            <div className="card border-warning">
                                <div className="card-body">
                                    <h5 className="card-title text-warning">
                                        <i className="bi bi-key me-2"></i>Admin Login
                                    </h5>
                                    <form onSubmit={handleAdminLogin}>
                                        <div className="row align-items-end">
                                            <div className="col-md-8 mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={adminPassword}
                                                    onChange={(e) => setAdminPassword(e.target.value)}
                                                    placeholder="Enter admin password"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn btn-warning flex-fill">Login</button>
                                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                                        setShowAdminLogin(false);
                                                        setAdminError('');
                                                        setAdminPassword('');
                                                    }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        {adminError && <div className="alert alert-danger">{adminError}</div>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AddSongForm
                    show={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddItem}
                    newItem={newItem}
                    setNewItem={setNewItem}
                />

                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="mb-0">
                                <i className="bi bi-music-note-list me-2"></i>Song Queue
                            </h3>
                            {completedCount > 0 && (
                                <button
                                    className={`btn ${showCompletedSongs ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => setShowCompletedSongs(!showCompletedSongs)}
                                >
                                    <i className={`bi ${showCompletedSongs ? 'bi-eye-slash' : 'bi-eye'} me-2`}></i>
                                    {showCompletedSongs ? 'Hide' : 'Show'} Completed ({completedCount})
                                </button>
                            )}
                        </div>

                        {filteredItems.length === 0 && items.length > 0 && !showCompletedSongs ? (
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <i className="bi bi-check-circle display-1 text-success mb-3"></i>
                                    <h5 className="text-muted">All songs completed!</h5>
                                    <button className="btn btn-outline-success" onClick={() => setShowCompletedSongs(true)}>
                                        View Completed Songs
                                    </button>
                                </div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <i className="bi bi-music-note-beamed display-1 text-muted mb-3"></i>
                                    <h5 className="text-muted">No songs in the queue yet</h5>
                                    <p className="text-muted">Be the first to add a song!</p>
                                </div>
                            </div>
                        ) : (
                            filteredItems.map((item) => {
                                const originalIndex = items.findIndex(originalItem => originalItem.id === item.id);
                                const isNextToPlay = originalIndex === nextSongIndex && !item.is_completed;

                                return (
                                    <KaraokeItem
                                        key={item.id}
                                        item={item}
                                        currentUsername={username || 'Anonymous'}
                                        isAdmin={isAdmin}
                                        isNextToPlay={isNextToPlay}
                                        onToggleComplete={() => handleToggleComplete(item.id)}
                                        onDelete={() => handleDeleteItem(item.id)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KaraokePage;