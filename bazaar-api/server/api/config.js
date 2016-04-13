import { MaterialsSchema } from '/server/collections/materials';
import { MetadataSchema } from '/server/collections/metadata';
import { ImageSchema } from '/server/collections/images';

// Application namespace
const Bazaar = {
  protocol: 'http',
  baseUrl: 'localhost:3000',
  demoProductId: 'new-cool-product_248' // Showcase demo product for /lms/view
};

// Accounts config
Accounts.config({
  loginExpirationInDays: 1
});

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
  },
  host: Bazaar.baseUrl,
  basePath: ('/'+Bazaar.Api.v2._config.apiPath).slice(0,-1),
  schemes: [ Bazaar.protocol ],
  securityDefinitions: {
    userId: {
      type: "apiKey",
      name: "X-User-Id",
      in: "header"
    },
    authToken: {
      type: "apiKey",
      name: "X-Auth-Token",
      in: "header"
    }
  }
};

// Swagger definitions
Bazaar.Api.v2.swagger.definitions = {
  material: MaterialsSchema.material,
  metadata: MetadataSchema.metadata,
  image: ImageSchema.image,
  lmsBrowse: {
    type: "object",
    required: [
      "first_name",
      "last_name",
      "user_id",
      "context_id",
      "context_title",
      "role",
      "school",
      "school_id",
      "city",
      "city_id"
    ],
    properties: {
      "first_name": {
        type: "string",
        minLength: 1,
        maxLength: 255

      },
      "last_name": {
        type: "string",
        minLength: 1,
        maxLength: 255
      },
      "email": {
        type: "string",
        pattern: "email"
      },
      "user_id": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "context_id": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "context_title": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "role": {
        type: "string",
        enum: [ "student", "teacher", "admin" ]
      },
      "school": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "school_id": {
        type: "string",
        minLength: 5,
        maxLength: 10
      },
      "city": {
        type: "string",
        minLength: 1,
        maxLength: 64
      },
      "city_id": {
        type: "string",
        minLength: 1,
        maxLength: 10
      },
      "oid": {
        type: "string",
        minLength: 1,
        maxLength: 32
      },
      "add_resource_callback_url": {
        type: "string",
        pattern: "uri"
      },
      "cancel_url": {
        type: "string",
        pattern: "uri"
      }
    }
  },
  lmsView: {
    type: "object",
    required: [
      "first_name",
      "last_name",
      "user_id",
      "context_id",
      "context_title",
      "role",
      "school",
      "school_id",
      "city",
      "city_id"
    ],
    properties: {
      "first_name": {
        type: "string",
        minLength: 1,
        maxLength: 255

      },
      "last_name": {
        type: "string",
        minLength: 1,
        maxLength: 255
      },
      "email": {
        type: "string",
        pattern: "email"
      },
      "user_id": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "context_id": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "context_title": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "role": {
        type: "string",
        enum: [ "student", "teacher", "admin" ]
      },
      "school": {
        type: "string",
        minLength: 1,
        maxLength: 128
      },
      "school_id": {
        type: "string",
        minLength: 5,
        maxLength: 10
      },
      "city": {
        type: "string",
        minLength: 1,
        maxLength: 64
      },
      "city_id": {
        type: "string",
        minLength: 1,
        maxLength: 10
      },
      "oid": {
        type: "string",
        minLength: 1,
        maxLength: 32
      },
      "resource_uid": {
        type: "string",
        minLength: 128,
        maxLength: 128
      },
      "return_url": {
        type: "string",
        pattern: "uri"
      }
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
    description: "Material object.",
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
  },
  lmsBrowse: {
    name: "browse",
    in: "body",
    description: "LMS browse request data",
    required: true,
    schema: {
      $ref: "#/definitions/lmsBrowse"
    }
  },
  lmsView: {
    name: "view",
    in: "body",
    description: "LMS view request data",
    required: true,
    schema: {
      $ref: "#/definitions/lmsView"
    }
  }
};

// Add swagger tags
Bazaar.Api.v2.swagger.tags = {
  cms: "CMS",
  lms: "LMS"
};



// Generate Swagger to route /api/v2/swagger.json
Bazaar.Api.v2.addSwagger('swagger.json');

export { Bazaar };
