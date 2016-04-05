import { Bazaar } from '/server/api/config';
import { Materials } from '/server/collections/materials';

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
          Bazaar.Api.v2.swagger.params.material
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
          Bazaar.Api.v2.swagger.params.material
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
          Bazaar.Api.v2.swagger.params.material
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
          Bazaar.Api.v2.swagger.params.material
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
          Bazaar.Api.v2.swagger.params.material
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
