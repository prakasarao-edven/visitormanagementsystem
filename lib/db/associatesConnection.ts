import mysql from "mysql2/promise";

export const associatesPool = mysql.createPool({
  host: process.env.ASSOC_DB_HOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.ASSOC_DB_PORT || process.env.DB_PORT || "3306"),
  user: process.env.ASSOC_DB_USER || process.env.DB_USER || "root",
  password: process.env.ASSOC_DB_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.ASSOC_DB_NAME || "edvenswa_dev",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export default associatesPool;
