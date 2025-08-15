const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

// Import routes
const technologyRoutes = require("./routes/technologies");
const filterRoutes = require("./routes/filters");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: {
    success: false,
    error: "Too many requests, please try again later",
  },
});
app.use("/api", limiter);

// Compression
app.use(compression());

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Documentation (Swagger)
if (process.env.ENABLE_API_DOCS === "true") {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Technology Radar API",
        version: "1.0.0",
        description: "API for Technology Radar application",
      },
      servers: [
        {
          url: `http://${process.env.HOST || "localhost"}:${
            process.env.PORT || 3001
          }`,
          description: "Development server",
        },
      ],
    },
    apis: ["./src/routes/*.js"],
  };

  const specs = swaggerJsdoc(swaggerOptions);
  app.use(
    process.env.API_DOCS_PATH || "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Technology Radar API is running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API routes
app.use("/api/technologies", technologyRoutes);
app.use("/api/filters", filterRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  logger.info(`Technology Radar API server running on http://${HOST}:${PORT}`);
  if (process.env.ENABLE_API_DOCS === "true") {
    logger.info(
      `API Documentation available at http://${HOST}:${PORT}${
        process.env.API_DOCS_PATH || "/api-docs"
      }`
    );
  }
});

module.exports = app;
