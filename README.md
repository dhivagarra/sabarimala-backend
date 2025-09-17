# Node.js + TypeScript + Express + PostgreSQL (AWS RDS)

## Setup

1. Copy `.env.example` to `.env` and fill in your actual AWS PostgreSQL credentials.
2. Install dependencies:
   ```
npm install
   ```
3. Build and run the server (development):
   ```
npx ts-node src/index.ts
   ```

## Environment Variables
- `PORT`: Port for Express server (default: 3000)
- `DB_HOST`: AWS RDS PostgreSQL hostname
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## Test Database Connection
Visit `http://localhost:3000/db` after starting the server to verify DB connectivity.
