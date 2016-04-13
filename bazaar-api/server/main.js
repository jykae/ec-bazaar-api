import { Meteor } from 'meteor/meteor';
import { Metadata } from '/server/collections/metadata';

Meteor.startup(() => {
  // Load metadata for empty DB
  if (Metadata.find().count() === 0) {
    JSON.parse(Assets.getText("metadata.json")).metadatas.forEach(function (obj) {
      Metadata.insert(obj);
    });
  }
});
