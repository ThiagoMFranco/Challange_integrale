import "dotenv/config";
import app from "./app.js";
import env from "./config/env.js";

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Integrale Leads API                              ║
║   Server running on port ${PORT}                          ║
║   Environment: ${NODE_ENV}                             ║
╚════════════════════════════════════════════════════╝
  `);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
