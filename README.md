# Book Dashboard - Full Stack Engineering Test

A full-stack application for managing books, built with React (Chakra UI), NestJS GraphQL API, SQLite, and Auth0 for authentication.

## Project Structure

```
book-dashboard/
├── backend/          # NestJS GraphQL API
├── frontend/         # React SPA with Chakra UI
└── README.md
```

## Features

- ✅ Admin sign up and sign in using Auth0
- ✅ Book table/list view
- ✅ Create, edit, and delete books
- ✅ GraphQL API with JWT authentication
- ✅ SQLite database

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account (free tier available)

## Setup Instructions

### 1. Auth0 Configuration

1. Create a free account at [Auth0](https://auth0.com/)
2. Create a new Application:
   - Application Type: Single Page Application
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Create an API:
   - Identifier (Audience): `https://book-dashboard-api`
   - Signing Algorithm: RS256
4. Note down the following values:
   - Domain (e.g., `your-tenant.auth0.com`)
   - Client ID
   - Audience (API Identifier)

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
AUTH0_ISSUER_URL=https://YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://book-dashboard-api
```

Replace `YOUR_AUTH0_DOMAIN` with your Auth0 domain.

Start the backend:

```bash
npm run start:dev
```

The GraphQL playground will be available at `http://localhost:4000/graphql` (authentication required).

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_AUTH0_AUDIENCE=https://book-dashboard-api
REACT_APP_GRAPHQL_URL=http://localhost:4000/graphql
```

Replace the values with your Auth0 configuration.

Start the frontend:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Sign In" to authenticate with Auth0
3. After authentication, you'll see the book dashboard
4. Use "Create New Book" to add books
5. Use the edit/delete icons to modify or remove books

## GraphQL API

The API is protected and requires authentication. All queries and mutations require a valid JWT token.

### Queries

- `books`: Get all books
- `book(id: Int!)`: Get a single book by ID

### Mutations

- `createBook(createBookInput: CreateBookInput!)`: Create a new book
- `updateBook(updateBookInput: UpdateBookInput!)`: Update an existing book
- `removeBook(id: Int!)`: Delete a book

## Database

The SQLite database file (`books.db`) will be created automatically in the `backend` directory when you first run the application.

## Deployment

This project can be deployed to GitHub and Vercel. For detailed step-by-step instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Steps

1. **Deploy to GitHub**:
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bookdesk.git
   git push -u origin main
   ```

2. **Deploy Frontend to Vercel**:
   - Import your GitHub repository in Vercel
   - Set root directory to `frontend`
   - Add environment variables (see DEPLOYMENT.md)
   - Deploy

3. **Deploy Backend**:
   - Option A: Deploy to Vercel (see `backend/vercel.json`)
   - Option B: Deploy to Railway (recommended for NestJS)

**Important**: Update your Auth0 application settings with production URLs before deploying.

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Technologies Used

- **Frontend**: React, TypeScript, Chakra UI, Apollo Client, Auth0 React SDK
- **Backend**: NestJS, TypeScript, GraphQL, TypeORM, SQLite, Passport JWT
- **Authentication**: Auth0

## License

MIT

