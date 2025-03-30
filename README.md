# WealthForge

WealthForge is an immersive 3D game built with React Three Fiber and Electron, offering a unique gaming experience across desktop platforms.

## 🚀 Features

- Immersive 3D gameplay using React Three Fiber
- Cross-platform desktop application (Windows, macOS, Linux)
- Modern UI with Tailwind CSS
- Physics-based interactions using Rapier
- Character controls with ECCTRL
- Background music and sound effects
- Multi-language support
- Responsive design

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **3D Rendering**: Three.js
- **Physics Engine**: React Three Rapier
- **Styling**: Tailwind CSS
- **Desktop Framework**: Electron
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (Latest LTS version)
- Bun package manager
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuvibirdi/WealthForge.git
   cd WealthForge
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   # For web development
   bun run dev

   # For desktop development
   bun run electron:dev
   ```

4. **Build for production**
   ```bash
   bun run electron:build
   ```

   > **Note**: The building processes has be tested on Linux and Works I didn't have access to other operating systems to test yet.

## 📁 Project Structure

```
WealthForge/
├── src/                    # Source files
│   ├── assets/            # Static assets
│   ├── characters/        # Character models and animations
│   ├── components/        # Reusable React components
│   ├── models/            # 3D models
│   └── utils/             # Utility functions
├── electron/              # Electron main process
├── public/                # Public assets
└── dist/                  # Build output
```

## 🎮 Game Features

- Interactive 3D world
- Character customization
- Physics-based gameplay
- Dynamic lighting system
- Background music
- Multi-language support
- Phone menu interface
- Game over screen

## 🔧 Development

- **Linting**: `bun run lint`
- **Preview**: `bun run preview`
- **Build**: `bun run build`
- **Electron Dev**: `bun run electron:dev`
- **Electron Build**: `bun run electron:build`

## 📦 Building for Different Platforms

The application can be built for multiple platforms:

- **Windows**: NSIS installer
- **macOS**: DMG package
- **Linux**: AppImage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
