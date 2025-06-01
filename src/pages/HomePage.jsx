import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    // Load username from cookies on component mount
    useEffect(() => {
        const savedUsername = getCookie('karaokeUsername');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    // Cookie helper functions
    const setCookie = (name, value, days = 30) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);

        // Save to cookies immediately
        if (newUsername.trim()) {
            setCookie('karaokeUsername', newUsername.trim());
        }
    };

    const handleCreateKaraoke = () => {
        if (username.trim()) {
            setCookie('karaokeUsername', username.trim());
        }
        navigate('/create-karaoke');
    };

    const handleAccessKaraoke = () => {
        if (username.trim()) {
            setCookie('karaokeUsername', username.trim());
        }
        navigate('/access-karaoke');
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-secondary-subtle">
            <div className="text-center">
                <div className="mb-5">
                    <h1 className="display-4 fw-bold text-primary mb-3">🎤 Karaoke App</h1>
                    <p className="lead text-secondary">
                        Start your karaoke experience or join an existing session
                    </p>
                </div>

                {/* Username Input */}
                <div className="mb-4">
                    <div className="card mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="card-body">
                            <h6 className="card-title text-start mb-3">
                                <i className="bi bi-person me-2"></i>
                                Your Name
                            </h6>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Enter your name for karaoke songs"
                                value={username}
                                onChange={handleUsernameChange}
                                maxLength={50}
                            />
                            <div className="form-text text-start">
                                This will be used when you add songs to any session
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-grid gap-3 col-6 mx-auto">
                    <button
                        className="btn btn-primary btn-lg py-3 fw-semibold"
                        onClick={handleCreateKaraoke}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create New Karaoke Session
                    </button>

                    <button
                        className="btn btn-outline-primary btn-lg py-3 fw-semibold"
                        onClick={handleAccessKaraoke}
                    >
                        <i className="bi bi-key me-2"></i>
                        Join Existing Session
                    </button>
                </div>

                <div className="mt-4">
                    <small className="text-muted">
                        Create a new session to host karaoke or enter a code to join others
                    </small>
                </div>
            </div>
        </div>
    );
}

export default HomePage;