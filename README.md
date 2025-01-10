
# Backend Setup: Express with Prisma and PostgreSQL

This guide walks you through the process of setting up and running the backend server built with Express, Prisma, and PostgreSQL.

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

### Step 3: Create an Environment File
- Create a `.env` file in the root directory of the project. This file will store all the environment variables required for the application to run.

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
- **`JWTSECRET`**: A secret key used for JWT authentication (you can use a custom secret for better security).
- **`DATABASE`**: Name of the database.
- **`DATABASEHOST`**: Host of the database server (commonly `localhost` for local setups).
- **`DATABASEUSER`**: Username to connect to the PostgreSQL database.
- **`DATABASEPASSWORD`**: Password for the database user.
- **`PORT`**: Port number on which the backend server will run.
- **`DATABASE_URL`**: Connection URL for Prisma to connect to PostgreSQL.

---

### Updating the `DATABASE_URL`
Replace the placeholders in the connection string as follows:
- `USERNAME` => Your PostgreSQL username.
- `PASSWORD` => Your PostgreSQL password.
- `PORT` => The port on which PostgreSQL is running (default is `5432`).
- `DATABASENAME` => The name of your PostgreSQL database.

Example:
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/warrantyit?schema=public
```

---

### Step 5: Apply Database Migrations
- Run the following command to synchronize the Prisma schema with the database:
  ```bash
  npx prisma migrate dev
  ```

### Step 6: Start the Server
- Finally, start the backend server using the following command:
  ```bash
  npm start
  ```
- The server will start on the port specified in the `.env` file (default: 6002).