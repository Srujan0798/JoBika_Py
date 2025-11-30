import React, { useEffect, useState } from 'react';
import { getApplications, updateApplicationStatus } from '../services/applications';

const ApplicationTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await getApplications();
            setApplications(data);
        } catch (err) {
            setError('Failed to load applications.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateApplicationStatus(id, newStatus);
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'interviewing': return 'bg-yellow-100 text-yellow-800';
            case 'offer': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div className="text-destructive">{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Application Tracker</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Date Applied</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} className="bg-card border-b border-border hover:bg-muted/50">
                                <td className="px-4 py-3 font-medium">{app.company}</td>
                                <td className="px-4 py-3">{app.role}</td>
                                <td className="px-4 py-3">{new Date(app.dateApplied).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        className="p-1 border border-input rounded text-xs bg-background"
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="interviewing">Interviewing</option>
                                        <option value="offer">Offer</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applications.length === 0 && (
                    <p className="text-center p-4 text-muted-foreground">No applications tracked yet.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationTracker;
