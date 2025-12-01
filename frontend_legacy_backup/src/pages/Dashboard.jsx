import React from 'react';
import { Link } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobMatches from '../components/JobMatches';
import AICoach from '../components/AICoach';
import ApplicationTracker from '../components/ApplicationTracker';
import Networking from '../components/Networking';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">JoBika Dashboard</h1>
                <div className="flex gap-4">
                    <Link to="/profile" className="px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20">
                        Profile
                    </Link>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90">
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Resume & Matches */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <ResumeUpload />
                    </section>
                    <section>
                        <JobMatches />
                    </section>
                    <section>
                        <ApplicationTracker />
                    </section>
                </div>

                {/* Right Column: AI Coach & Networking */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="sticky top-8 space-y-8">
                        <AICoach />
                        <Networking />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
