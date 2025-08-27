// Profile Settings Screen
export type Profile = {
	uid: string;
	name: string;
	email: string;
	avatar: string;
	campaignId?: string;
}

// Auto Upload Data Settings Screen
export type AutoUploadMode = 'WiFi Only' | 'WiFi + Mobile' | 'Off';

export type SyncDataStat = {
	lastUploadTime: Date;
	pendingRecordsCount: number;
}

// Permission Settings Screen
type PermissionStatus = '미설정' | '허용됨' | '거부됨';

export type Permission = {
	id: string;
	key: string;
	icon: string;
	name: string;
	status: PermissionStatus;
}

// Sensor Settings Screen
export type Sensor = {
	key: string;
	icon: string;
	name: string;
	desc: string;
}

// Bluetooth Connected Devices Screen
export type BLEConnectionStatus =
	| 'DISCONNECTED'  // 연결되지 않음
	| 'CONNECTING'    // 연결 중
	| 'CONNECTED'     // 연결됨
	| 'DISCONNECTING' // 연결 해제 중

export type BLEDevice = {
	id: string;
	name: string;
	status: BLEConnectionStatus;
}

// Campaign Screen
export type Campaign = {
	id: string;
	name: string;
	description: string;
}
