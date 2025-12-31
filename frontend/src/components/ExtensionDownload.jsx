import React, { useState } from 'react';
import { Download, Chrome, CheckCircle, AlertCircle } from 'lucide-react';
import './ExtensionDownload.css';

function ExtensionDownload() {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Download Extension",
            description: "Download the Cognify extension ZIP file",
            icon: <Download size={32} />
        },
        {
            title: "Extract ZIP",
            description: "Extract the ZIP file to a folder on your computer",
            icon: <CheckCircle size={32} />
        },
        {
            title: "Enable Developer Mode",
            description: "Open Chrome extensions and enable Developer Mode",
            icon: <Chrome size={32} />
        },
        {
            title: "Load Extension",
            description: "Click 'Load unpacked' and select the extracted folder",
            icon: <CheckCircle size={32} />
        }
    ];

    const handleDownload = () => {
        // This will download the extension ZIP from the public folder
        const link = document.createElement('a');
        link.href = '/cognify-extension.zip';
        link.download = 'cognify-extension.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="extension-download-page">
            <div className="download-hero">
                <div className="hero-content">
                    <Chrome size={64} className="hero-icon" />
                    <h1>Install Cognify Extension</h1>
                    <p>Track your time and boost productivity with our Chrome extension</p>
                    <button className="download-btn-large" onClick={handleDownload}>
                        <Download size={24} />
                        Download Extension
                    </button>
                    <p className="download-note">Free • Works on Chrome, Brave, Edge & all Chromium browsers</p>
                </div>
            </div>

            <div className="installation-guide">
                <h2>Installation Guide</h2>
                <p className="guide-intro">Follow these simple steps to install the extension:</p>

                <div className="steps-container">
                    {steps.map((s, index) => (
                        <div
                            key={index}
                            className={`step-card ${step === index ? 'active' : ''}`}
                            onClick={() => setStep(index)}
                        >
                            <div className="step-number">{index + 1}</div>
                            <div className="step-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.description}</p>
                        </div>
                    ))}
                </div>

                <div className="detailed-instructions">
                    {step === 0 && (
                        <div className="instruction-content">
                            <h3>Step 1: Download Extension</h3>
                            <ol>
                                <li>Click the "Download Extension" button above</li>
                                <li>Save the <code>cognify-extension.zip</code> file to your computer</li>
                                <li>Remember where you saved it (e.g., Downloads folder)</li>
                            </ol>
                            <button className="next-btn" onClick={() => setStep(1)}>Next Step →</button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="instruction-content">
                            <h3>Step 2: Extract ZIP File</h3>
                            <ol>
                                <li>Locate the downloaded <code>cognify-extension.zip</code> file</li>
                                <li>Right-click on the ZIP file</li>
                                <li>Select "Extract All..." or "Extract Here"</li>
                                <li>A new folder called <code>cognify-extension</code> will be created</li>
                            </ol>
                            <div className="tip-box">
                                <AlertCircle size={20} />
                                <p><strong>Tip:</strong> Keep this folder in a permanent location. Don't delete it after installation!</p>
                            </div>
                            <button className="next-btn" onClick={() => setStep(2)}>Next Step →</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="instruction-content">
                            <h3>Step 3: Enable Developer Mode</h3>
                            <ol>
                                <li>Open Chrome (or Brave/Edge)</li>
                                <li>Type <code>chrome://extensions</code> in the address bar and press Enter</li>
                                <li>Look for the "Developer mode" toggle in the top-right corner</li>
                                <li>Turn ON Developer mode (toggle should be blue)</li>
                            </ol>
                            <div className="screenshot-placeholder">
                                <p>📸 You'll see new buttons appear: "Load unpacked", "Pack extension", "Update"</p>
                            </div>
                            <button className="next-btn" onClick={() => setStep(3)}>Next Step →</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="instruction-content">
                            <h3>Step 4: Load Extension</h3>
                            <ol>
                                <li>Click the <strong>"Load unpacked"</strong> button</li>
                                <li>Navigate to the extracted <code>cognify-extension</code> folder</li>
                                <li>Select the folder and click "Select Folder"</li>
                                <li>The Cognify extension will appear in your extensions list</li>
                                <li>Pin it to your toolbar by clicking the puzzle icon and pinning Cognify</li>
                            </ol>
                            <div className="success-box">
                                <CheckCircle size={24} />
                                <div>
                                    <h4>Installation Complete! 🎉</h4>
                                    <p>Click the Cognify icon in your toolbar to start tracking time!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="troubleshooting-section">
                <h2>Troubleshooting</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>Extension not showing up?</h4>
                        <p>Make sure you selected the correct folder (the one containing manifest.json). Try refreshing the extensions page.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Can't find Developer Mode?</h4>
                        <p>It's in the top-right corner of chrome://extensions page. You might need to scroll up to see it.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Extension keeps getting disabled?</h4>
                        <p>This is normal for unpacked extensions. Just re-enable it when Chrome asks. Keep the extension folder in a permanent location.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Works on other browsers?</h4>
                        <p>Yes! Works on Brave, Edge, Opera, and any Chromium-based browser. Use the same installation steps.</p>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2>What You Get</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h4>⏱️ Automatic Time Tracking</h4>
                        <p>Tracks time spent on every website automatically. Only counts active time.</p>
                    </div>
                    <div className="feature-card">
                        <h4>🎯 Focus Mode</h4>
                        <p>Block distracting websites for a set duration to stay focused.</p>
                    </div>
                    <div className="feature-card">
                        <h4>📊 Detailed Analytics</h4>
                        <p>View comprehensive statistics on your personal dashboard.</p>
                    </div>
                    <div className="feature-card">
                        <h4>🔄 Cross-Browser Sync</h4>
                        <p>Use the same account across Chrome, Brave, and other browsers.</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to Get Started?</h2>
                <button className="download-btn-large" onClick={handleDownload}>
                    <Download size={24} />
                    Download Extension Now
                </button>
                <p>Already installed? <a href="/">Go to Dashboard →</a></p>
            </div>
        </div>
    );
}

export default ExtensionDownload;
