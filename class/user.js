const rand = require('randomstring');
const IDLENGTH = 16;

class User {
    /**
     * User object
     * @param {string} sessionId User SessionID string , if empty , will create by random
     * @param {*} sessionData stored data
     */
    constructor(sessionId, sessionData) {
        if (!sessionId) {
            sessionId = this.__genNewId();
        }

        this.sessionId = sessionId;
        this.starttime = 0;
        this.endtime = 0;
        this.data = sessionData;
    }

    __genNewId () {
        //generate a new sessionId
        return rand.generate({
            length: IDLENGTH,
            charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        });
    }
}

module.exports = User;