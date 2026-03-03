import axios from './axios';

export const triggerManualSyncRequest = async () => {
    return await axios.post('/sync/manual');
};

export const getSyncStatusRequest = async () => {
    return await axios.get('/sync/status');
};
