# One Plus Training & Development

Professional website for training and development programs and consultations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Cloudflare R2
- **Hosting**: Netlify

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages
- `/app/admin` - Admin dashboard pages
- `/lib` - Utility functions and configurations
- `/components` - Reusable React components

## Environment Variables

See `.env.local.example` for required environment variables.
