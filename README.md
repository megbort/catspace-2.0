# Catspace v2.0

Welcome to Catspace—the social media platform designed just for cats! Imagine Myspace, but tailored specifically for our feline friends.

This is the second version of the project, now upgraded to the latest version of Angular. While I'm building on the core concept from the original project, this version will feature ongoing updates and enhancements.

Enjoy exploring Catspace!

— Megan Krenbrink

## <br>

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

npm run serve

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

Open [http://localhost:4200](http://localhost:4200) to view the app.

## 🛠️ Tech Stack

- **Angular** with **TypeScript**
- **Tailwind CSS** for styling
- **Angular Material** for UI components
- **Storybook** for UI development
- **Firestore** for backend/data

## 📁 Project Structure

```
src/
├── app/                # Main application code (components, pages, services, shared)
│   ├── components/     # Reusable UI and feature components
│   │   └── ui/         # UI primitives (buttons, banners, etc.)
│   ├── pages/          # Route-based feature pages
│   ├── services/       # App services (API, state, mocks, models)
│   ├── shared/         # Shared utilities, types, directives, pipes
│   └── ...             # Other app logic
├── assets/             # Static assets (images, translations)
├── stories/            # Storybook stories for components
├── styles/             # Global and theme styles
└── environments/       # Environment configs
```

## 🔗 Backend Integration

This frontend uses Firestore for data, but can be adapted for any API. Some data is mocked for demo purposes.
