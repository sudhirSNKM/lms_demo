const Collection = require('../utils/jsonDb');

class ActivityCollection extends Collection {
    constructor() {
        super('activities');
    }
}

module.exports = new ActivityCollection();
