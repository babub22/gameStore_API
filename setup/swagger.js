const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-auth-token",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    info: {
      title: "Game Store Express REST API documentation",
      description: "REST API for Game store web-application",
      contact: {
        name: "Vladyslav Lisovyi (babub22)",
        url: "https://github.com/babub22",
        email: "vladlesovoy2@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./routes/docs/*.yaml"],
};

const specs = swaggerJsdoc(options);

function swagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
}

module.exports = swagger;
