const Images = new Mongo.Collection('images');

// Materials JSON schema
const ImageSchema = {
  "image": {
    type: "object",
    required: [
      "thumbnail",
      "standard_resolution",
      "low_resolution"
    ],
    properties: {
      "thumbnail": {
        type: "object",
        properties: {
          "url": {
            type: "string"
          },
          "width": {
            type: "integer"
          },
          "height": {
            type: "integer"
          }
        }
      },
      "standard_resolution": {
        type: "object",
        properties: {
          "url": {
            type: "string"
          },
          "width": {
            type: "integer"
          },
          "height": {
            type: "integer"

          }
        }
      },
      "low_resolution": {
        type: "object",
        properties: {
          "url": {
            type: "string"
          },
          "width": {
            type: "integer"
          },
          "height": {
            type: "integer"
          }
        }
      }
    }
  }
};

// Materials JSON Schema definition
const imageJSONSchema = new JSONSchema(ImageSchema);

// Convert to Simple Schema
Images.schema = imageJSONSchema.toSimpleSchema();
Images.attachSchema(Images.schema);

export { Images, ImageSchema };
