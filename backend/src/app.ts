import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import env from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use("/api", routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `Route ${req.path} not found`,
  });
});

app.use(
  (
    err: Error & { statusCode?: number; status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error("Unhandled error:", err);

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? "Internal server error" : "Bad request",
      message: err.message,
    });
  },
);

export default app;
