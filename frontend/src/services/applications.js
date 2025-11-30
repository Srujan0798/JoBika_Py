import api from './auth';

export const getApplications = async () => {
    const response = await api.get('/applications');
    return response.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
};

export const createApplication = async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
};
