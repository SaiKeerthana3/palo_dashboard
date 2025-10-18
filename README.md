# Palo Alto Networks Policy Dashboard

A modern web application for creating and managing Palo Alto Networks security policy rules.

## Features

- **Intuitive Policy Creation**: Step-by-step wizard for creating security policies
- **Tab-based Navigation**: Organized sections for General, Source, Destination, Application, Service/URL Category, and Actions
- **Real-time Validation**: Instant feedback on required fields and configurations
- **Rule Summary**: Quick overview of all policy settings before submission
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

All dependencies are already installed. The project includes:
- react & react-dom
- lucide-react (icons)
- TypeScript
- Vite
- Tailwind CSS

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Palo_dashboard/
├── src/
│   ├── components/
│   │   └── PolicyCreationForm.tsx    # Main policy form component
│   ├── App.tsx                        # Root application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles with Tailwind
├── index.html                         # HTML entry point
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.js                 # Tailwind CSS configuration
└── package.json                       # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Policy Configuration

The form supports comprehensive policy configuration including:

- **General Settings**: Rule name, description, tags, and rule type
- **Source Configuration**: Zones, addresses, users, with negation support
- **Destination Configuration**: Zones and addresses with negation support
- **Application Filtering**: App-ID based controls
- **Service/URL Filtering**: Service and URL category restrictions
- **Actions & Logging**: Action types, logging options, security profiles, and schedules

## License

ISC

