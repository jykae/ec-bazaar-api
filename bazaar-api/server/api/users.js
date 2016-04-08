import { Bazaar } from '/server/api/config';

// Generates: POST on /api/v2/users and
// GET, DELETE /api/v2/users/:id for Meteor.users collection
Bazaar.Api.v2.addCollection(Meteor.users, {
  excludedEndpoints: ['getAll', 'put'],
  routeOptions: {
    authRequired: true
  },
  endpoints: {
    post: {
      authRequired: false
    },
    delete: {
      roleRequired: 'admin'
    }
  }
});
