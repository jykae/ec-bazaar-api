import { ImageSchema } from '/server/collections/images';
import { MetadataSchema } from '/server/collections/metadata';

// Material collection
const Materials = new Mongo.Collection('materials');

// Materials JSON schema
const MaterialsSchema = {
  "definitions": {
    "image": ImageSchema.image,
    "metadata": MetadataSchema.metadata
  },
  "material": {
    type: "object",
    required: [
      "name",
      "description",
      "language",
      "publisherId"
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
        type: "string" // TODO: Use "bshamblen:iso-languages" package!!
      },
      "publisherId": {
        type: "string" // Publisher user ID
      },
      "publisherData": {
        type: "string" // Clarify what this could be?
      },
      "metadata": {
        type: "array",
        items: "string" // Metadata objectID
      },
      "tags": {
        type: "array",
        maxItems: 32,
        items: [
          {
            type: "string",
            maxLength: 64
          }
        ]
      },
      "images": {
        type: "array",
        items: {"$ref": "#/definitions/image"}
      }
    }
  }
};

// Materials JSON Schema definition
const materialsJSONSchema = new JSONSchema(MaterialsSchema);

// Convert to Simple Schema
Materials.schema = materialsJSONSchema.toSimpleSchema();
Materials.attachSchema(Materials.schema);

export { Materials, MaterialsSchema };
