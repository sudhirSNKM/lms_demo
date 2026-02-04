const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
    constructor(filename) {
        this.filepath = path.join(DATA_DIR, `${filename}.json`);
        this.data = [];
        this.load();
    }

    load() {
        if (fs.existsSync(this.filepath)) {
            const content = fs.readFileSync(this.filepath, 'utf-8');
            try {
                this.data = JSON.parse(content);
            } catch (e) {
                this.data = [];
            }
        } else {
            this.data = [];
        }
    }

    save() {
        fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2));
    }

    generateId() {
        return crypto.randomBytes(12).toString('hex');
    }

    // Mongoose-like methods
    async find(query = {}) {
        this.load();
        return this.data.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    }

    async findOne(query = {}) {
        this.load();
        const item = this.data.find(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
        if (item) return this.attachMethods(item);
        return null;
    }

    async findById(id) {
        this.load();
        const item = this.data.find(item => item._id === id);
        if (item) return this.attachMethods(item);
        return null;
    }

    async create(doc) {
        this.load();
        const newItem = { _id: this.generateId(), ...doc, createdAt: new Date() };
        this.data.push(newItem);
        this.save();
        return this.attachMethods(newItem);
    }

    async findByIdAndUpdate(id, update, options) {
        this.load();
        const index = this.data.findIndex(item => item._id === id);
        if (index === -1) return null;

        this.data[index] = { ...this.data[index], ...update };
        this.save();
        return this.attachMethods(this.data[index]);
    }

    async deleteOne(query) {
        // Should be called on a document usually in my controller logic?
        // Controller calls `lead.deleteOne()`.
        // Or `Model.deleteOne()`.
        // Let's implement Model.deleteMany for seeder
    }

    async deleteMany() {
        this.data = [];
        this.save();
    }

    attachMethods(item) {
        // Attach helper methods to the object (like save, matchPassword, deleteOne)
        // Since we are returning a plain object + methods, we need to be careful.
        // We can mimic the document instance.
        const self = this;
        return {
            ...item,
            deleteOne: async function () {
                self.load();
                self.data = self.data.filter(d => d._id !== item._id);
                self.save();
            },
            // For User model specifics, we can inject them later or check the collection name.
        };
    }
}

module.exports = Collection;
