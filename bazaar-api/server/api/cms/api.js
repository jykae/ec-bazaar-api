import { Bazaar } from '/server/api/config';
import { Materials } from '/server/collections/materials';

// Generates: GET, POST on /api/items and GET, PUT, DELETE on
// /api/items/:id for the Items collection
Bazaar.Api.v2.addCollection(Materials);
