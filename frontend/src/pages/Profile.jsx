import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profile';

const Profile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        currentCompany: '',
        currentRole: '',
        experienceYears: 0,
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: '',
        location: '',
        preferredLocations: [],
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Mock data for now if API fails or returns empty
            const data = await getProfile().catch(() => ({
                fullName: 'Roshwin Ram',
                email: 'roshwin@example.com',
                currentCTC: '15 LPA',
                noticePeriod: '30 Days'
            }));
            setProfile(prev => ({ ...prev, ...data }));
        } catch (err) {
            console.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateProfile(profile);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="min-h-screen bg-background p-8 flex justify-center">
            <div className="w-full max-w-2xl bg-card rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-2xl font-bold text-primary mb-6">Your Profile</h1>

                {message && (
                    <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full p-2 rounded border border-input bg-background" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" name="email" value={profile.email} disabled className="w-full p-2 rounded border border-input bg-muted text-muted-foreground" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Company</label>
                            <input type="text" name="currentCompany" value={profile.currentCompany} onChange={handleChange} className="w-full p-2 rounded border border-input bg-background" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Role</label>
                            <input type="text" name="currentRole" value={profile.currentRole} onChange={handleChange} className="w-full p-2 rounded border border-input bg-background" />
                        </div>
                    </div>

                    <div className="border-t border-border pt-6">
                        <h2 className="text-lg font-semibold mb-4">India Specific Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Current CTC (LPA)</label>
                                <input type="text" name="currentCTC" value={profile.currentCTC} onChange={handleChange} placeholder="e.g. 15 LPA" className="w-full p-2 rounded border border-input bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Expected CTC (LPA)</label>
                                <input type="text" name="expectedCTC" value={profile.expectedCTC} onChange={handleChange} placeholder="e.g. 20 LPA" className="w-full p-2 rounded border border-input bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notice Period</label>
                                <select name="noticePeriod" value={profile.noticePeriod} onChange={handleChange} className="w-full p-2 rounded border border-input bg-background">
                                    <option value="">Select Notice Period</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="15 Days">15 Days</option>
                                    <option value="30 Days">30 Days</option>
                                    <option value="60 Days">60 Days</option>
                                    <option value="90 Days">90 Days</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Location</label>
                                <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="e.g. Bangalore" className="w-full p-2 rounded border border-input bg-background" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
