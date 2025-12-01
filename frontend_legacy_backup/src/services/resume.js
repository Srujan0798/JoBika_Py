import api from './auth';

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resumes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const tailorResume = async (resumeId, jobDescription) => {
    const response = await api.post(`/resumes/${resumeId}/tailor`, { jobDescription });
    return response.data;
};

export const getResumes = async () => {
    const response = await api.get('/resumes');
    return response.data;
};
