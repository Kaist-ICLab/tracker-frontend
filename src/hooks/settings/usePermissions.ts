import { useState } from 'react';
import { Permission } from '@/types/settings';

const MOCK_PERMISSIONS: Permission[] = [
  { id: 'perm1', key: 'location', icon: 'location', name: '위치', status: '허용됨' },
  { id: 'perm2', key: 'activity', icon: 'walk', name: '신체활동', status: '거부됨' },
  { id: 'perm3', key: 'notification', icon: 'notifications', name: '알림', status: '허용됨' },
  { id: 'perm4', key: 'storage', icon: 'folder', name: '저장소', status: '허용됨' },
  { id: 'perm5', key: 'bluetooth', icon: 'bluetooth', name: '블루투스', status: '거부됨' },
];


export const usePermissions = () => {
  const [permissions, setPermissions] = useState(MOCK_PERMISSIONS);

  const requestPermission = async (permissionKey: string, enabled: boolean) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.key === permissionKey
          ? { ...permission, status: enabled ? '허용됨' : '거부됨' }
          : permission
      )
    );
  };


  return {
    permissions,
    requestPermission,
  };
}; 