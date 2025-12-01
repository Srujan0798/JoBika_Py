import React, { useEffect, useState } from 'react';
import { getJobMatches, applyToJob } from '../services/jobs';

const JobMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const data = await getJobMatches();
            setMatches(data);
        } catch (err) {
            setError('Failed to load job matches.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await applyToJob(jobId);
            alert('Application submitted successfully!');
            // Optimistically update UI or refetch
        } catch (err) {
            alert('Failed to apply.');
        }
    };

    if (loading) return <div>Loading matches...</div>;
    if (error) return <div className="text-destructive">{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Top Job Matches</h2>
            {matches.length === 0 ? (
                <p className="text-muted-foreground">No matches found yet. Try uploading your resume.</p>
            ) : (
                <div className="grid gap-4">
                    {matches.map((match) => (
                        <div key={match.id} className="p-4 bg-card rounded-lg border border-border flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{match.title}</h3>
                                <p className="text-sm text-muted-foreground">{match.company} • {match.location}</p>
                                <div className="mt-1 flex gap-2">
                                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                        {match.matchScore}% Match
                                    </span>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                        ₹{match.salary}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleApply(match.id)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobMatches;
