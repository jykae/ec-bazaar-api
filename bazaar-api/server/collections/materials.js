import Bazaar from '/server/api/config';

Materials = new Mongo.Collection('materials');

// Materials JSON Schema definition
const materialsJSONSchema = new JSONSchema({
  "$schema": "http://json-schema.org/draft-04/schema#",

  "definitions": {
    "image": {
      type: "object",
      required: [
        "thumbnail",
        "standard_resolution",
        "low_resolution"
      ],
      properties: {
        "thumbnail": {
          type: "string"
        },
        "standard_resolution": {
          type: "string"
        },
        "low_resolution": {
          type: "string"
        }
      }
    }
  },

  type: "object",
  required: [
    "name",
    "description",
    "language"
  ],
  properties: {
    "name": {
      type: "string",
      maxLength: 255
    },
    "description": {
      type: "string",
      maxLength: 2048
    },
    "language": {
      type: "string" // ISO 639-1 language codes
    },
    "publisher_data": {
      type: "string"
    },
    "metadata": {
      type: "array",
      items: "string"
    },
    "tags": {
      type: "array",
      items: "string"
    },
    "images": {
      type: "array",
      items: {"$ref": "#/definitions/image"}
    }
  }
});

// Convert to Simple Schema
const materialsSchema = materialsJSONSchema.toSimpleSchema();
Materials.attachSchema(materialsSchema);

export { Materials };
