import { Bazaar } from '/server/api/config';
import { Materials } from '/server/collections/materials';
import { Metadata } from '/server/collections/metadata';

// Generates: GET, POST on /api/items and GET, PUT, DELETE on
// /api/items/:id for the Items collection
Bazaar.Api.v2.addCollection(Materials, {
  path: 'cms/materials',
  routeOptions: {
    authRequired: true
  },
  endpoints: {
    get: {
      swagger: {
        tags: [
          Bazaar.Api.v2.swagger.tags.cms
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
          Bazaar.Api.v2.swagger.tags.cms
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
          Bazaar.Api.v2.swagger.tags.cms
        ],
        description: "Update material with given ID.",
        parameters: [
          Bazaar.Api.v2.swagger.params.materialId,
          Bazaar.Api.v2.swagger.params.material
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
          Bazaar.Api.v2.swagger.tags.cms
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
          Bazaar.Api.v2.swagger.tags.cms
        ],
        description: "Returns publisher's own materials.",
        responses: {
          "200": {
            description: "List of materials."
          }
        }
      },
      action: function () {
        // Init response
        const response = {};

        // Get publisherId from authentication headers
        const publisherId = this.request.headers['x-user-id'];

        // Check publisherId exists
        if( publisherId ) {
          // Fetch materials by publisherId
          response.status = "success";
          response.data = Materials.find({ "material.publisherId": publisherId }).fetch();
        } else {
          // Throw status 404 with description
          response.status = "404";
          response.description = "User ID does not exist.";
        }

        // Return result
        return response;
      }
    }
  }
});

// GET ALL metadata
// Parameters: countryCode, optional
// Example: /api/v2/metadata/?countryCode=fi
Bazaar.Api.v2.addRoute('cms/metadata/', {authRequired: true}, {
  get: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.cms
      ],
      description: "Returns all available metadata, optional filtering by countryCode.",
      parameters: [
        Bazaar.Api.v2.swagger.params.countryCode
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

// Validate token
// Required headers: X-User-Id, X-Auth-Token
// Example: /api/v2/cms/validate
Bazaar.Api.v2.addRoute('cms/validate', {authRequired: true}, {
  get: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.cms
      ],
      description: "Validate user authToken for viewing material.",
      parameters: [],
      responses: {
        "200": {
          description: "Successful validation."
        },
        "401": {
          description: "Token timeout or token already used."
        }
      }
    },
    action: function () {
      // Init response
      const response = {};

      // Get authToken from headers
      const userId = this.request.headers['x-user-id'];
      const authToken = this.request.headers['x-auth-token'];

      // Get existing token
      const validToken = Meteor.users.findOne({"_id": userId}).services.resume.loginTokens[0].hashedToken;

      if( Accounts._hashLoginToken(authToken) === validToken ) {
        // Get user
        const authenticatedUser = Meteor.users.findOne({"_id": userId});

        // Write response
        response.status = "200";
        response.data = {
          user: authenticatedUser
        };
      } else {
        response.status = "401";
        response.description = "Invalid token or user ID";
      }

      // Return result
      return response;
    }
  }
});
