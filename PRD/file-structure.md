# File Structure

## Project Root
```
/
├── src/
│   ├── types/
│   │   └── index.ts          # Type definitions
│   ├── config/
│   │   └── params.ts         # Parameter configurations
│   ├── core/
│   │   ├── sketch.ts         # p5.js main sketch
│   │   ├── shapes.ts         # Shape drawing functions
│   │   ├── gui.ts           # GUI management
│   │   └── presets.ts        # Preset management
│   ├── utils/
│   │   ├── datetime.ts       # Date formatting
│   │   └── sidebar.ts        # Sidebar functionality
│   └── main.ts              # Application entry point
├── public/
│   └── assets/              # Static assets
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md               # Project documentation
```

## Key Components

### Types
- Global type definitions
- Interface declarations
- Type exports

### Config
- Default parameters
- Configuration constants
- Parameter state management

### Core
- Main application logic
- Drawing functions
- UI component management
- Preset handling

### Utils
- Helper functions
- Utility modules
- Reusable components

### Entry Points
- HTML template
- Main TypeScript file
- Asset management

## Module Dependencies
```
main.ts
  ├── core/sketch.ts
  │     ├── core/shapes.ts
  │     └── config/params.ts
  ├── core/gui.ts
  │     └── config/params.ts
  ├── core/presets.ts
  │     ├── utils/datetime.ts
  │     └── config/params.ts
  └── utils/sidebar.ts
```

## Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── assets/
``` 