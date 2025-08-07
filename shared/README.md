# WellNest Shared

This directory contains code shared between the frontend and backend of the WellNest application.

## Structure

- `src/`: Source code
  - `types/`: Shared TypeScript type definitions
  - `utils/`: Shared utility functions

## Development

```bash
# Build shared code
npm run build
```

## Usage

The shared code can be imported in both frontend and backend code:

```typescript
// In frontend code
import { User } from '../../shared/src/types';

// In backend code
import { User } from '../shared/src/types';
```

After building, the compiled JavaScript files will be available in the `dist` directory.