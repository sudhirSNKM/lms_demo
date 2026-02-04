const Collection = require('../utils/jsonDb');

class LeadCollection extends Collection {
    constructor() {
        super('leads');
    }
}

module.exports = new LeadCollection();
