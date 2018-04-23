class Session {
    constructor() {
        this.map = new Map();
    }

    /**
     * 取得 session map 內指定 id 的 User 物件
     * @param {string} sessionId User Session ID
     */
    get(sessionId) {
        return this.map.get(sessionId);
    }

    /**
     * 根據 User.Id 進行新增或修改 session map
     * @param {any} userObj User 物件
     */
    set(userObj) {
        let nw = Number(new Date());
        const obj = this.get(userObj.sessionId);
        if (obj) {
            obj.endtime = nw;
            // if data is empty then will not update original data
            if (userObj.data && typeof userObj.data === 'object' && userObj.data.length > 0) {
                obj.data = userObj.data;
            }
        }
        else {
            userObj.starttime = nw;
            userObj.endtime = nw;
            this.map.set(userObj.sessionId, userObj);
        }
    }

    /**
     * 根據指定 id 是否存在，回傳 true or false
     * @param {string} sessionId User SessionID
     * @returns {boolean} 存在 true，不存在 false
     */
    has(sessionId) {
        return this.map.has(sessionId);
    }

    /**
     * 根據指定 id 刪除 session map 內資料
     * @param {string} sessionId User ID
     */
    delete(sessionId) {
        return this.map.delete(sessionId);
    }

    /**
     * 取得目前 Session map 大小
     */
    size() {
        return this.map.size;
    }
}

module.exports = Session;