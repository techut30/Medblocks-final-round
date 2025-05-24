# 🏥 Patient Registration System

> A modern, frontend-only patient management application built with React, TypeScript, and PGlite. Features real-time cross-tab synchronization and persistent data storage entirely in the browser.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://medblocks-final.vercel.app/)
[![GitHub](https://img.shields.io/badge/Source%20Code-black?style=for-the-badge&logo=github)](https://github.com/techut30/Medblocks-final-round)

## 🚀 Live Demo

**[Try the Application →](https://medblocks-final.vercel.app/)**


## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript |
| **Database** | PGlite (PostgreSQL in browser) |
| **Storage** | IndexedDB |
| **Styling** | Custom CSS with Flexbox/Grid |
| **Build Tool** | Create React App |
| **Deployment** | Vercel |
| **Sync** | BroadcastChannel API |

## 🏗️ Project Structure

```
.
├── .gitignore
├── .vercel/
│   ├── README.txt
│   └── project.json
├── README.md
├── build/
│   ├── asset-manifest.json
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── static/
│       ├── css/
│       ├── js/
│       └── media/
├── package-lock.json
├── package.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Form_Registration.tsx
│   │   ├── PatientList.tsx
│   │   └── Query.tsx
│   ├── db.ts
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
└── tsconfig.json
```

## 📋 Requirements

- Node.js 16+ 
- npm or yarn
- Modern browser with IndexedDB support

## 🚀 Installation

### Clone the repository
```bash
git clone https://github.com/techut30/Medblocks-final-round.git
cd Medblocks-final-round
```

### Install dependencies
```bash
npm install
```

## 🛠️ Setup

### Start development server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Run tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## 🏗️ Building for Production

### Create optimized production build
```bash
npm run build
```

### Serve locally to test production build
```bash
npx serve -s build
```

The build folder will contain optimized static files ready for deployment.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
