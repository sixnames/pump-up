# Day Console Development Guidelines

This document provides essential information for developers working on the Day Console project.

## Build/Configuration Instructions

### Prerequisites

- Node.js v18.20.2 or >=20.9.0
- pnpm v10.10.0 (package manager)
- MongoDB (for database)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Environment Configuration:
    - Copy `.env.example` to `.env`
    - Update the environment variables as needed, especially MongoDB connection details

3. Development Server:
   ```bash
   # Standard development server
   pnpm dev
   
   # Safe development server (clears .next directory first)
   pnpm devsafe
   ```

4. Build for Production:
   ```bash
   pnpm build
   ```

5. Start Production Server:
   ```bash
   pnpm start
   ```

### Docker Setup

The project includes Docker configuration for easier development:

```bash
# Start the Docker environment
pnpm up

# Stop the Docker containers
pnpm stop

# Remove the Docker containers
pnpm down
```

## Testing Information

### Testing Framework

The project uses Cypress for end-to-end testing.

### Running Tests

```bash
# Open Cypress test runner
pnpm cypress:open

# Run all tests in headless mode
pnpm test
```

### Test Structure

- Tests are located in the `cypress/e2e` directory
- Test fixtures are in `cypress/fixtures`
- Custom commands and utilities are in `cypress/support` and `cypress/cypressUtils`

### Writing Tests

1. Create a new test file in `cypress/e2e` with the `.cy.ts` extension
2. Use the standard Cypress describe/it pattern
3. Utilize custom commands defined in `cypress/support/index.ts`

### Example Test

```typescript
describe('My Feature', () => {
  it('should perform expected action', () => {
    // Authenticate as admin
    cy.testAuth('/my-feature-path');

    // Interact with UI elements using custom commands
    cy.cyClick('my-button');
    cy.cyType('my-input', 'test value');

    // Assert expected outcomes
    cy.getByCy('result-element').should('contain', 'Expected Result');
  });
});
```

### Test Data

- Use `cy.seedTestData()` to populate the database with test data
- Test data seeding script is located at `lib/helpers/seedTestDB.ts`

## Code Style Guidelines

### Linting and Formatting

The project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
pnpm lint
```

### Prettier Configuration

- Line endings: LF
- Semicolons: required
- Single quotes for JavaScript and JSX
- Tab width: 2 spaces
- Print width: 140 characters
- Trailing commas: always
- Arrow function parentheses: always

### TypeScript

- The project uses TypeScript for type safety
- Types are generated from Payload CMS using `pnpm generate:types`

## Project Structure

### Key Directories

- `/collections`: Payload CMS collections
- `/components`: React components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and constants
- `/app`: Next.js app directory
- `/cypress`: Testing files

### Database

- MongoDB is used as the database
- Payload CMS provides the ORM layer
- Database connection is configured in `.env` file

## Additional Development Information

### Payload CMS

This project uses Payload CMS (v3.36.0) as the content management system. Key commands:

```bash
# Generate TypeScript types from Payload collections
pnpm generate:types

# Generate import map for Payload
pnpm generate:importmap
```

### UI Components

The project uses a combination of custom components and Radix UI primitives for the user interface.

### Authentication

- Admin authentication is handled by Payload CMS
- Test credentials are defined in the Cypress configuration