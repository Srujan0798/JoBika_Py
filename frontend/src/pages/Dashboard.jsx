import React from 'react';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background p-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h2 className="text-xl font-semibold mb-2">Job Matches</h2>
                    <p className="text-muted-foreground">0 New Matches</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h2 className="text-xl font-semibold mb-2">Applications</h2>
                    <p className="text-muted-foreground">0 Active</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h2 className="text-xl font-semibold mb-2">Interviews</h2>
                    <p className="text-muted-foreground">0 Scheduled</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
