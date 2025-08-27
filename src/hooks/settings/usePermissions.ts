import { useEffect, useState } from 'react';
import { Permission } from '@/types/settings';
import AndroidTrackerLib from '../../../modules/android-tracker-lib';
import { Linking } from 'react-native';
import { WAITING_TIME } from '@/constants/config';

const iconForGroup = (groupKey: string): string => {
  const key = groupKey.toLowerCase();
  if (key.includes('notification')) return 'notifications';
  if (key.includes('location') && key.includes('background')) return 'navigate';
  if (key.includes('location')) return 'location';
  if (key.includes('sensor') || key.includes('body')) return 'fitness';
  if (key.includes('usage')) return 'time';
  if (key.includes('accessibility')) return 'accessibility';
  return 'settings';
};

const mapStateToKorean = (state: string): Permission['status'] => {
  switch (state) {
    case 'GRANTED':
      return '허용됨';
    case 'NOT_REQUESTED':
      return '미설정';
    case 'RATIONALE_REQUIRED':
    case 'PERMANENTLY_DENIED':
    default:
      return '거부됨';
  }
};

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const groups = AndroidTrackerLib.getSupportedPermissions?.() ?? [];
      const mapped: Permission[] = groups.map(g => ({
        id: g.groupKey,
        key: g.groupKey,
        icon: iconForGroup(g.groupKey),
        name: g.name,
        status: mapStateToKorean(g.state),
      }));

      setPermissions(mapped);
    } catch (e) {
      setError('권한 정보를 불러오지 못했어요');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const requestPermission = async (permissionKey: string, enabled: boolean) => {
    try {
      if (enabled) {
        // Request permission normally to the android native module
        AndroidTrackerLib.requestPermissionGroup?.(permissionKey);
      } else {
        // For turning off permissions, redirect to app settings
        await Linking.openSettings();
      }
      setTimeout(loadPermissions, WAITING_TIME);
    } catch (e) {
      setTimeout(loadPermissions, WAITING_TIME);
    }
  };

  return {
    permissions,
    loading,
    error,
    requestPermission,
  };
};
