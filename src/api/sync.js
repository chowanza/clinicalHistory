import axios from './axios';

export const triggerManualSyncRequest = async () => {
    return await axios.post('/sync/manual');
};
