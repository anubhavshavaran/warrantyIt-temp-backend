# Backend Setup

This guide walks you through the process of setting up and running the backend server built with Express, Prisma, and PostgreSQL.

---

## Prerequisites
- **Node.js**: Version 18 or higher (recommended due to ESM support).
- **PostgreSQL**: Installed and running on your machine (default port: `5432`).
- **Git**: For cloning the repository.
- **NPM**: For installing dependencies.

---

## Steps to Run the Backend

### Step 1: Clone the Git Repository
1. Clone the repository using the following command:
   ```bash
   git clone <repository_url>
   ```
2. Navigate into the project folder:
   ```bash
   cd <project_folder>
   ```

### Step 2: Install Dependencies
- Inside the project directory, install the necessary dependencies by running:
  ```bash
  npm install
  ```
- This will install all dependencies listed in `package.json`, including:

### Step 3: Create an Environment File
- Create a `.env` file in the root directory of the project to store environment variables required for the application.

### Step 4: Configure the Environment Variables
- Add the following environment variables to the `.env` file and replace the placeholder values with your configuration:

  ```env
  JWTSECRET=Pass@123
  DATABASE=WARRANTYIT
  DATABASEHOST=localhost
  DATABASEUSER=root
  DATABASEPASSWORD=Pass@123
  PORT=6002
  DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:PORT/DATABASENAME?schema=public
  ```

#### Explanation of Variables:
- **`JWTSECRET`**: Secret key for JWT authentication (use a strong, unique secret for production).
- **`DATABASE`**: Name of the PostgreSQL database.
- **`DATABASEHOST`**: Host of the database server (usually `localhost` for local setups).
- **`DATABASEUSER`**: Username for PostgreSQL.
- **`DATABASEPASSWORD`**: Password for the PostgreSQL user.
- **`PORT`**: Port for the Express server (default: `6002`).
- **`DATABASE_URL`**: Prisma connection string for PostgreSQL.

#### Updating the `DATABASE_URL`
Replace placeholders in the connection string:
- `USERNAME` => Your PostgreSQL username (e.g., `postgres`).
- `PASSWORD` => Your PostgreSQL password.
- `PORT` => PostgreSQL port (default: `5432`).
- `DATABASENAME` => Database name (e.g., `warrantyit`).

Example:
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/warrantyit?schema=public
```

#### Additional Environment Variables
Based on the dependencies (e.g., `nodemailer`, `redis`, `openai`), you may need additional variables. Add these to `.env` if required by your application:
- **Redis**:
  ```env
  REDIS_URL=redis://localhost:6379
  ```
- **Nodemailer** (for email):
  ```env
  EMAIL_HOST=smtp.example.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@example.com
  EMAIL_PASS=your-email-password
  ```
- **OpenAI** (for AI features):
  ```env
  OPENAI_API_KEY=your-openai-api-key
  ```
- **Google Auth** (for OAuth):
  ```env
  GOOGLE_CLIENT_ID=**************
  GOOGLE_CLIENT_SECRET=**************
  GOOGLE_CLIENT_CALLBACK_URL=**************
  CLIENT_APP_URL=**************
  ```

- **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Credentials from your Google Developer Console.
- **GOOGLE_CLIENT_CALLBACK_URL**: The backend route Google will redirect to after authentication.
- **CLIENT_APP_URL**: The URL scheme your frontend uses to handle the JWT token.

### Google Strategy Setup
  ```env
  const passport = require("passport");
  const { Strategy } = require("passport-google-oauth20");
  
  passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
  ```

### Authentication Callback Handler
  ```env
   const handleUserWithGoogle = async (req, res) => {
     try {
       ...
       
       if (existingUser) {
         const token = signToken(existingUser.userId);
         return res.redirect(`${process.env.CLIENT_APP_URL}?token=${token}`);
       }
       
       ...
       
       res.redirect(`${process.env.CLIENT_APP_URL}?token=${token}`);
     } catch (e) {
       ...
     }
   };
  ```

Check your application code or documentation for specific requirements.

### Step 5: Set Up the Database
1. Ensure PostgreSQL is running and the database specified in `DATABASE_URL` exists. Create it if needed:
   ```bash
   psql -U postgres -c "CREATE DATABASE warrantyit;"
   ```
2. Apply Prisma migrations to synchronize the schema with the database:
   ```bash
   npx prisma migrate dev
   ```
    - This command creates tables based on your Prisma schema and runs any pending migrations.
    - If you need to generate the Prisma client, run:
      ```bash
      npx prisma generate
      ```

### Step 6: Start the Server
- Start the backend server in production mode:
  ```bash
  npm start
  ```
- For development with auto-restart on changes (using `nodemon`):
  ```bash
  npm run dev
  ```
- The server will run on the port specified in `.env` (default: `6002`). Access it at `http://localhost:6002`.

---