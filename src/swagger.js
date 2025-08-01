import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RiotStats API",
    version: "1.0.0",
    description: "API documentation for RiotStats (based on Riot Games API)",
  },
  servers: [
    {
      url: "http://localhost:3000", 
      description: "Local development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*.js"], // or wherever you keep your route files
};

export const swaggerSpec = swaggerJSDoc(options);
