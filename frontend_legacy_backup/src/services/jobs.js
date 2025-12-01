import api from './auth';

export const getJobMatches = async () => {
    const response = await api.get('/jobs/matches');
    return response.data;
};

export const applyToJob = async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
};
