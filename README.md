# EasyRentBackEnd

A modern property management system built with React, TypeScript, and Supabase.

## Features

- 🏠 Property Management
- 👥 Tenant Management
- 📊 Accounting & Financial Tracking
- 📝 Contract Management
- 🔍 Property Inspections
- 🛠️ Maintenance Requests
- ⚙️ System Settings

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context + Hooks
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Styling**: Material-UI + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EasyRentBackEnd.git
   cd EasyRentBackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── constants/      # Application constants
├── hooks/          # Custom React hooks
├── lib/            # Third-party library configurations
├── pages/          # Page components
├── routes/         # Routing configuration
├── theme/          # Material-UI theme
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── App.tsx         # Root component
```

## Development

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components and hooks
- Implement proper error handling
- Write meaningful comments

### Testing

Run tests using:
```bash
npm test
# or
yarn test
```

### Building

Create a production build:
```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.