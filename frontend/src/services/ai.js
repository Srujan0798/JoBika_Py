import api from './auth';

export const sendChatMessage = async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
};
