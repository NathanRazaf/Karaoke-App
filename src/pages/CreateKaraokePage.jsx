import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../api/karaokeRoutes.js';

function CreateKaraokePage() {
    const [title, setTitle] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (alphanumeric.length <= 1) {
            const newCode = [...code];
            newCode[index] = alphanumeric;
            setCode(newCode);
            if (alphanumeric && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const newCode = [...code];
        for (let i = 0; i < Math.min(pastedText.length, 6); i++) {
            newCode[i] = pastedText[i];
        }
        setCode(newCode);
        const nextEmptyIndex = newCode.findIndex(char => char === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
        inputRefs.current[focusIndex]?.focus();
    };

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

        // Added: Validate custom access code if provided
        const fullCode = code.join('');
        if (fullCode && fullCode.length !== 6) {
            setError('Access code must be 6 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Modified: Pass fullCode (or null) as access_code to createSession
            const response = await createSession(title.trim(), adminPassword.trim(), fullCode || null);
            // The API returns the session data in response.data with access_code
            if (response.data && response.data.access_code) {
                navigate(`/access-karaoke/${response.data.access_code}`);
            } else {
                // Handle case where response doesn't have expected format
                navigate('/');
            }
        } catch (err) {
            // Modified: Enhanced error handling for duplicate access code
            if (err.message && err.message.toLowerCase().includes('already exists')) {
                setError('Access code already exists');
            } else {
                setError('Failed to create session. Please try again.');
            }
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

                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Custom access code (optional)
                            </label>
                            <div
                                className="d-flex justify-content-start gap-2 mb-2"
                                onPaste={handlePaste}
                                style={{ maxWidth: '300px' }}
                            >
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            fontSize: '18px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            border: '2px solid #dee2e6',
                                            borderRadius: '8px',
                                            backgroundColor: digit ? '#f8f9fa' : 'white',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#0d6efd';
                                            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#dee2e6';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }}
                                        maxLength={1}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            <div className="form-text">
                                Leave empty to auto-generate a code
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