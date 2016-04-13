import { Bazaar } from '/server/api/config';

// LMS Browse
// Path: /api/v2/lms/browse
Bazaar.Api.v2.addRoute('lms/browse', {authRequired: true}, {
  post: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.lms
      ],
      description: "Browse and select material.",
      parameters: [
        Bazaar.Api.v2.swagger.params.lmsBrowse
      ],
      responses: {
        "200": {
          description: "Returns Bazaar browse URL."
        }
      }
    },
    action: function () {
      // Init response
      const response = {};

      // Return success and Bazaar catalogue view URL
      response.success = 1;
      response.browse_url = Bazaar.protocol+'://'+Bazaar.baseUrl+'/catalogue';

      // Return result
      return response;
    }
  }
});

// LMS view
// Path: /api/v2/lms/view
Bazaar.Api.v2.addRoute('lms/view', {authRequired: true}, {
  post: {
    swagger: {
      tags: [
        Bazaar.Api.v2.swagger.tags.lms
      ],
      description: "View material.",
      parameters: [
        Bazaar.Api.v2.swagger.params.lmsView
      ],
      responses: {
        "200": {
          description: "Returns unique Bazaar view URL."
        }
      }
    },
    action: function () {
      // Init response
      const response = {};

      // Return success and unique Bazaar view URL
      response.success = 1;
      response.view_url = Bazaar.protocol+'://'+Bazaar.baseUrl+'/'+Bazaar.demoProductId;

      // Return result
      return response;
    }
  }
});
