// knexfile.js
require("dotenv").config({ path: "../.env" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10, // Reduced from 20 to prevent overwhelming the connection
      idleTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
    acquireConnectionTimeout: 60000, // Increased timeout
  },
};
