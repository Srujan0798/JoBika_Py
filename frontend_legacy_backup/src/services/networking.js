import api from './auth';

export const getConnections = async () => {
    const response = await api.get('/networking/connections');
    return response.data;
};

export const requestReferral = async (connectionId, jobId) => {
    const response = await api.post(`/networking/referral`, { connectionId, jobId });
    return response.data;
};
