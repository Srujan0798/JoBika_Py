import React, { useEffect, useState } from 'react';
import { getConnections, requestReferral } from '../services/networking';

const Networking = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const data = await getConnections();
            setConnections(data);
        } catch (err) {
            console.error('Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const handleReferral = async (connectionId) => {
        try {
            await requestReferral(connectionId, 'JOB123'); // Mock Job ID for now
            alert('Referral request sent!');
        } catch (err) {
            alert('Failed to send request.');
        }
    };

    if (loading) return <div>Loading connections...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Networking & Referrals</h2>
            <div className="grid gap-4">
                {connections.length === 0 ? (
                    <p className="text-muted-foreground">No connections found. Connect your LinkedIn to find referrals.</p>
                ) : (
                    connections.map((conn) => (
                        <div key={conn.id} className="p-4 bg-card rounded-lg border border-border flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                                    {conn.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{conn.name}</h3>
                                    <p className="text-sm text-muted-foreground">{conn.company} • {conn.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleReferral(conn.id)}
                                className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/5"
                            >
                                Ask for Referral
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Networking;
