import { Bazaar } from '/server/api/config';
import { Materials } from '/server/collections/materials';
import { Metadata } from '/server/collections/metadata';

// Generates: GET, POST on /api/items and GET, PUT, DELETE on
// /api/items/:id for the Items collection
Bazaar.Api.v2.addCollection(Materials, {
  routeOptions: {
    authRequired: true
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
      // TODO: Override action, get user's materials, when authentication is in place.
    }
  }
});

// GET ALL metadata
// Parameters: countryCode, optional
// Example: /api/v2/metadata/?countryCode=fi
Bazaar.Api.v2.addRoute('metadata/', {authRequired: true}, {
  get: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.material
      ],
      description: "Returns all available metadata, optional filtering by countryCode.",
      parameters: [
        Bazaar.Api.v2.swagger.params.country
      ],
      responses: {
        "200": {
          description: "List of metadata."
        }
      }
    },
    action: function () {
      // Init response
      const response = {};

      // Check if queryParams are given
      if(this.queryParams && this.queryParams.countryCode) {

        // Get countryCode from Query parameters
        const countryCode = this.queryParams.countryCode;
        // Allowed values for countryCode
        const countryCodesAllowed = ['global', 'en', 'fi', 'sv'];

        // Check countryCode is allowed
        if( _.contains(countryCodesAllowed, countryCode) ) {

          // Fetch metadata filtered by countryCode
          response.status = "success";
          response.data = Metadata.find({ "language": countryCode }).fetch();

        } else {

          // Throw status 404 with description
          response.status = "404";
          response.description = "countryCode allowed values are ['global', 'en', 'fi', 'sv']";

        }
      } else {

        // Fetch all metadata
        response.status = "success";
        response.data = Metadata.find().fetch();

      }

      // Return result
      return response;
    }
  }
});
