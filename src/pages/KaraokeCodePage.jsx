import { useState, useRef } from 'react';
import {useNavigate} from "react-router-dom";

function KaraokeCodePage() {
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        // Only allow numeric characters
        const numeric = value.replace(/[^0-9]/g, '');

        if (numeric.length <= 1) {
            const newCode = [...code];
            newCode[index] = numeric;
            setCode(newCode);

            // Auto-focus next input if current input is filled
            if (numeric && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === 'Paste' || (e.ctrlKey && e.key === 'v')) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        const newCode = [...code];

        for (let i = 0; i < Math.min(pastedText.length, 6); i++) {
            newCode[i] = pastedText[i];
        }

        setCode(newCode);

        // Focus the next empty input or the last one
        const nextEmptyIndex = newCode.findIndex(char => char === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 6) {
            navigate(`/access-karaoke/${fullCode}`);
        } else {
            alert('Please enter a complete 6-character code');
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center px-3">
            <div className="text-center mb-4">
                <h1 className="display-4 fw-bold mb-3">🎤 Karaoke Code</h1>
                <p className="mb-2">Entrez le code d'accès à la session de karaoké fourni par votre animateur.</p>
                <p className="fst-italic text-muted">Enter the access code to the karaoke session given by your animator.</p>
            </div>

            <div className="d-flex justify-content-center gap-2 gap-sm-3 mb-4 w-100" onPaste={handlePaste} style={{ maxWidth: '400px' }}>
                {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="form-control text-center fw-bold flex-shrink-0"
                            style={{
                                width: 'clamp(45px, 12vw, 60px)',
                                height: 'clamp(45px, 12vw, 60px)',
                                fontSize: 'clamp(18px, 5vw, 24px)',
                                border: '2px solid #dee2e6',
                                borderRadius: '12px',
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
                        />
                ))}
            </div>

            <div className="d-flex flex-column align-items-center gap-3">
                <button
                    className="btn btn-primary btn-lg px-5"
                    onClick={handleSubmit}
                    disabled={code.join('').length !== 6}
                    style={{
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    Enter Session
                </button>

                {code.some(char => char !== '') && (
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            setCode(['', '', '', '', '', '']);
                            inputRefs.current[0]?.focus();
                        }}
                    >
                        Clear Code
                    </button>
                )}

                <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => navigate('/')}
                >
                    <i className="bi bi-house me-2"></i>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default KaraokeCodePage;
