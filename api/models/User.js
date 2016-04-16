/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  schema: true,     // only save attributes in schema
  attributes: {
    passports: { collection: 'Passport', via: 'user' },

    username: {
      type: 'string',
      required: true,
      unique: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
  }
};
