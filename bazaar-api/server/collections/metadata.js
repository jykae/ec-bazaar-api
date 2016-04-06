const Metadata = new Mongo.Collection('metadata');

// Materials JSON schema
const MetadataSchema = {
  definitions: {
    "material": {
      type: "object",
      required: [
        "language"
      ],
      properties: {
        "language": {
          type: { "enum": [ "global", "en", "fi", "sv" ] } // TODO: Use "bshamblen:iso-languages" package!!
        },
        "educationLevel": {
          type: "integer",
          minimum: 1,
          maximum: 3
        },
        "class": {
          type: "integer",
          minimum: 0
        },
        "subject": {
          type: "string"
        }
      }
    }
  }
};

// Materials JSON Schema definition
const metadataJSONSchema = new JSONSchema(MetadataSchema);

// Convert to Simple Schema
Metadata.schema = metadataJSONSchema.toSimpleSchema();
Metadata.attachSchema(Metadata.schema);

export { Metadata, MetadataSchema };
