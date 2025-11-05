// Reexport the native module. On web, it will be resolved to TrackerSystemModule.web.ts
// and on native platforms to TrackerSystemModule.ts
export { default } from './src/TrackerSystemModule';
export { default as TrackerSystemView } from './src/TrackerSystemView';
export * from  './src/TrackerSystem.types';
