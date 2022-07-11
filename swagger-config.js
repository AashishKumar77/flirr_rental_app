
import swaggerJsDocs from "swagger-jsdoc";
import config from 'config';

const { URL, APIHOST } = config.get('APP');
const { superadmin } = config.get('PORTS');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Flirr APIs",
      version: "1.0",
      description: "Flirr APIs Documentation",
      contact: {
        name: "TeamCrafts Agency"
      },
      servers: [APIHOST + ":" + superadmin]
    },
    produces: ["application/json"],
    host: URL + ":" + superadmin
  },
  // eslint-disable-next-line no-undef
  apis: ["./routes/*.js", "./routes/admin/*.js"],
  layout: "AugmentingLayout"
}; 
export default swaggerJsDocs(swaggerOptions);