// Reexport the native module. On web, it will be resolved to AndroidTrackerLibModule.web.ts
// and on native platforms to AndroidTrackerLibModule.ts
export { default } from './src/AndroidTrackerLibModule';
export { default as AndroidTrackerLibView } from './src/AndroidTrackerLibView';
export * from  './src/AndroidTrackerLib.types';
