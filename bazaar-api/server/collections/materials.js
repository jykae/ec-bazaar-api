// Material collection
const Materials = new Mongo.Collection('materials');

// Materials JSON schema
const MaterialsSchema = {
  definitions: {
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
    },
    "material": {
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
          type: { "enum": [ "fi", "en", "sv" ] } // TODO: Use "bshamblen:iso-languages" package!!
        },
        "publisher_data": {
          type: "string"
        },
        "metadata": {
          type: "array",
          items: {"$ref": "#/definitions/metadata"}
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
  }
};

// Materials JSON Schema definition
const materialsJSONSchema = new JSONSchema(MaterialsSchema);

// Convert to Simple Schema
Materials.schema = materialsJSONSchema.toSimpleSchema();
Materials.attachSchema(Materials.schema);

export { Materials, MaterialsSchema };
