import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../api/karaokeRoutes.js';

function CreateKaraokePage() {
    const [title, setTitle] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Please enter a session title');
            return;
        }

        if (!adminPassword.trim()) {
            setError('Please enter an admin password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await createSession(title.trim(), adminPassword.trim());
            // The API returns the session data in response.data with access_code
            if (response.data && response.data.access_code) {
                navigate(`/access-karaoke/${response.data.access_code}`);
            } else {
                // Handle case where response doesn't have expected format
                navigate('/');
            }
        } catch (err) {
            setError('Failed to create session. Please try again.');
            console.error('Error creating session:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-warning-subtle">
            <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="card-title fw-bold text-primary mb-3">
                            🎤 Create Karaoke Session
                        </h2>
                        <p className="text-muted">
                            Give your karaoke session a name to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="sessionTitle" className="form-label fw-semibold">
                                Session Title
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="sessionTitle"
                                placeholder="Enter session title (e.g., Friday Night Karaoke)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                                maxLength={100}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="adminPassword" className="form-label fw-semibold">
                                Admin Password
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                id="adminPassword"
                                placeholder="Create a password to manage this session"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                disabled={isLoading}
                                maxLength={50}
                            />
                            <div className="form-text">
                                You'll need this password to delete songs and mark them as completed
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating Session...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Create Session
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleBack}
                                disabled={isLoading}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Home
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateKaraokePage;