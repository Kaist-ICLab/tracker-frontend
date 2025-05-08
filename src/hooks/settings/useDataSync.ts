import { AutoUploadMode, SyncDataStat } from '@/types/settings';
import { useState } from 'react';

// TODO: 실제 API 호출로 변경 필요  
const MOCK_DATA_SYNC = {
    autoUploadMode: 'WiFi Only' as AutoUploadMode,
    autoUploadInterval: 3600000 as number, // 1 hour in milliseconds
};

const MOCK_SYNC_DATA_STAT: SyncDataStat = {
    lastUploadTime: new Date(Date.now() - 3600000), // 1 hour ago
    pendingRecordsCount: 15,
};

export const useDataSync = () => {
    const [autoUploadMode, setAutoUploadMode] = useState(MOCK_DATA_SYNC.autoUploadMode);
    const [autoUploadInterval, setAutoUploadInterval] = useState(MOCK_DATA_SYNC.autoUploadInterval);
    const [syncDataStat, setSyncDataStat] = useState(MOCK_SYNC_DATA_STAT);

    const updateAutoUploadMode = async (mode: AutoUploadMode) => {
        setAutoUploadMode(mode);
    }

    const updateAutoUploadInterval = async (interval: number) => {
        setAutoUploadInterval(interval);
    }

    return {
        autoUploadMode,
        autoUploadInterval,
        syncDataStat,
        updateAutoUploadMode,
        updateAutoUploadInterval,
    };
}; 