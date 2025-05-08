# Tracker App

A React Native application for tracking and managing data.

## Coding Conventions

### Component Definitions

We use React.FC (Function Component) type for all React components. Props should be defined inline with the component type rather than as separate interfaces.

✅ Good:
```typescript
export const MyComponent: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ title, onPress }) => (
  // Component implementation
);
```

❌ Bad:
```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent = ({ title, onPress }: MyComponentProps) => (
  // Component implementation
);
```

### Styling

We use NativeWind (Tailwind CSS for React Native) for all styling. Avoid using StyleSheet.create() or inline styles.
However, if it is unavoidable due to using containerStyles, it is allowed.

✅ Good:
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Hello World</Text>
</View>
```

❌ Bad:
```typescript
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>
```

### File Organization

- Components are stored in the `src/components` directory
- Screens are stored in the `src/screens` directory
- Hooks are stored in the `src/hooks` directory
- Types are stored in the `src/types` directory

### Naming Conventions

- Component files use PascalCase (e.g., `DataCard.tsx`)
- Hook files use camelCase with 'use' prefix (e.g., `useDashboardData.ts`)
- Type files use PascalCase (e.g., `Dashboard.ts`)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Development

- Use TypeScript for all new code
- Write tests for new components and features
- Follow the coding conventions outlined above
- Use meaningful commit messages
- Keep components small and focused
- Use proper error handling
- Document complex logic with comments 


할일 
AuthScreen 토큰재발급 삭제 UI