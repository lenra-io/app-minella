const Document = require('./Document.js');

module.exports = class User extends Document {
    /**
     * @param {string} _id 
     * @param {*} navigation 
     */
    constructor(_id, navigation) {
        super(_id);
        this.navigation = navigation;
    }
}