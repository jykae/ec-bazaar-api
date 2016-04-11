import { MaterialsSchema } from '/server/collections/materials';
import { MetadataSchema } from '/server/collections/metadata';
import { ImageSchema } from '/server/collections/images';

// Application namespace
const Bazaar = {};

// Bazaar API
Bazaar.Api = {};

// Version 1
Bazaar.Api.v2 = new Restivus({
  apiPath: 'api/',
  version: 'v2',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true
});

// Init Restivus Swagger configuration
Bazaar.Api.v2.swagger = {};

// Add swagger meta
Bazaar.Api.v2.swagger.meta = {
  swagger: "2.0",
  info: {
    version: "2.0",
    title: "EduCloud Bazaar API",
    description: "EduCloud Bazaar REST API",
    termsOfService: "https://bazaar.educloudalliance.org/terms/",
    contact: {
      name: "Ville Jyrkkä"
    },
    license: {
      name: "MIT"
    }
  }
};

// Add swagger params
Bazaar.Api.v2.swagger.params = {
  materialId: {
    name: "id",
    in: "path",
    description: "Material ID",
    required: true,
    type: "string"
  },
  material: {
    name: "material",
    in: "body",
    description: "Material to add.",
    required: true,
    schema: {
      $ref: "#/definitions/material"
    }
  },
  countryCode: {
    name: "countryCode",
    in: "query",
    description: "Country code ISO-639-1. Enum: ['global','en','fi','sv'].",
    required: true,
    type: "string",
    enum: [ "global", "en", "fi", "sv" ] // TODO: Use "bshamblen:iso-languages" package!!
  }
};

// Add swagger tags
Bazaar.Api.v2.swagger.tags = {
  cms: "CMS",
  lms: "LMS"
};

// Init swagger definitions
Bazaar.Api.v2.swagger.definitions = {
  material: MaterialsSchema.material,
  metadata: MetadataSchema.metadata,
  image: ImageSchema.image
};

// Generate Swagger to route /api/v2/swagger.json
Bazaar.Api.v2.addSwagger('swagger.json');

export { Bazaar };
