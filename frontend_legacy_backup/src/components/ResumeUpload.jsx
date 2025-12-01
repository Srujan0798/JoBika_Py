import React, { useState } from 'react';
import { uploadResume, tailorResume } from '../services/resume';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [tailoredResume, setTailoredResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            const response = await uploadResume(file);
            // Assuming response contains the uploaded resume ID
            if (jobDescription) {
                const tailored = await tailorResume(response.id, jobDescription);
                setTailoredResume(tailored);
            }
        } catch (err) {
            setError('Failed to upload or tailor resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Resume Tailoring</h2>
            {error && <div className="text-destructive mb-4">{error}</div>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Upload Resume (PDF)</label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Job Description</label>
                    <textarea
                        className="w-full p-2 rounded border border-input bg-background"
                        rows="4"
                        placeholder="Paste job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>
                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Tailor Resume'}
                </button>
            </div>

            {tailoredResume && (
                <div className="mt-6 p-4 bg-muted rounded border border-border">
                    <h3 className="font-semibold mb-2">Tailored Content</h3>
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(tailoredResume, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
