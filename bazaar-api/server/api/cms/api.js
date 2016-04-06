import { Bazaar } from '/server/api/config';
import { Materials } from '/server/collections/materials';
import { Metadata } from '/server/collections/metadata';

// Generates: GET, POST on /api/items and GET, PUT, DELETE on
// /api/items/:id for the Items collection
Bazaar.Api.v2.addCollection(Materials, {
  routeOptions: {
    authRequired: false
  },
  endpoints: {
    get: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Get one material with given ID.",
        parameters: [
          Bazaar.Api.v2.swagger.params.materialId
        ],
        responses: {
          "200": {
            description: "One material"
          }
        }
      }
    },
    post: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Create a material.",
        parameters: [
          Bazaar.Api.v2.swagger.params.material
        ],
        responses: {
          "200": {
            description: "Return material that was added."
          }
        }
      }
    },
    put: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Update material with given ID.",
        parameters: [
          Bazaar.Api.v2.swagger.params.materialId
        ],
        responses: {
          "200": {
            description: "Returns updated material."
          }
        }
      }
    },
    delete: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Delete material with given ID.",
        parameters: [
          Bazaar.Api.v2.swagger.params.materialId
        ],
        responses: {
          "200": {
            description: "Successful deleted material with given ID."
          }
        }
      }
    },
    getAll: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Returns authenticated user's materials.",
        responses: {
          "200": {
            description: "List of materials."
          }
        }
      }
      // TODO: Override action, get user's materials
    }
  }
});

// GET ALL endpoint for Metadata
Bazaar.Api.v2.addCollection(Metadata, {
  routeOptions: {
    authRequired: false
  },
  endpoints: {
    getAll: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.material
        ],
        description: "Returns all available metadata.",
        responses: {
          "200": {
            description: "List of metadata."
          }
        }
      }
    }
  }
});

// GET metadata by country
// Maps to: /api/v2/metadata/:country
Bazaar.Api.v2.addRoute('metadata/:country', {authRequired: false}, {
  get: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.material
      ],
      description: "Returns all available metadata by country.",
      parameters: [
        Bazaar.Api.v2.swagger.params.country
      ],
      responses: {
        "200": {
          description: "List of metadata by country parameter."
        }
      }
    },
    action: function () {
      // Get organizationId from URL parameters
      const countryCode = this.urlParams.country;
      // Fetch all departments of the given organization
      const metadata = Metadata.find({ "language": countryCode }).fetch();

      // Build response
      const response = {
        status: "success",
        data: metadata
      }
      return response;
    }
  }
});
