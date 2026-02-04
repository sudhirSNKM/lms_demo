const Collection = require('../utils/jsonDb');
const bcrypt = require('bcryptjs');

class UserCollection extends Collection {
  constructor() {
    super('users');
  }

  async create(doc) {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
    return super.create(doc);
  }

  attachMethods(item) {
    const doc = super.attachMethods(item);
    doc.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
    return doc;
  }

  // Quick hack for chainable .select()
  findOne(query) {
    const self = this;
    const promise = super.findOne(query);
    promise.select = function () { return this; }; // Return the promise itself
    return promise;
  }
}

module.exports = new UserCollection();
