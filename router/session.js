const Router = require('koa-router');
const User = require('../class/user');
const router = new Router();
const UserSession = require('../class/session');
const user_session = new UserSession();
const Scheduler = require('node-schedule');
const expiredMin = Number(process.argv[3]) || 5;
const Request = require('request');

router.use((ctx, next) => {
    // append session to every ctx
    ctx.sessionMap = user_session;
    next();
});

/**
 * Router: create a new session by random sessionID
 * @returns {string} sessionID
 */
router.put('/', ctx => {
    let user = new User('', ctx.request.body);

    ctx.sessionMap.delete(user.sessionId);  // delete if existed
    ctx.sessionMap.set(user);

    ctx.status = 200;
    ctx.body = {
        sessionId: user.sessionId,
    };
});

/**
 * Router: create a new session by inputed sessionID
 * @returns {string} sessionID
 */
router.put('/:sessionId', ctx => {
    let user = new User(ctx.params.sessionId, ctx.request.body);

    ctx.sessionMap.delete(user.sessionId);  // delete if existed
    ctx.sessionMap.set(user);

    ctx.status = 200;
    ctx.body = {
        sessionId: user.sessionId,
    };
});

/**
 * Router: Update endtime and data(if data is empty, then will not update data)
 * @returns {statusCode} 200: OK, 404: session not found(or expired)
 */
router.post('/:sessionId', ctx => {
    let user = new User(ctx.params.sessionId, ctx.request.body);

    if (ctx.sessionMap.has(user.sessionId)) {
        ctx.sessionMap.set(user);
        ctx.status = 200;
    }
    else {
        ctx.status = 404;
    }
});

/**
 * Router: Get User 
 * @returns {statusCode} 200: OK, 404: session not found(or expired)
 * @returns {*} user object
 */
router.get('/:sessionId', ctx => {
    let user = ctx.sessionMap.get(ctx.params.sessionId);
    if (user) {
        ctx.status = 200;
        ctx.body = user;
    }
    else {
        ctx.status = 404;
    }
});

/**
 * Router: Delete User
 * @returns {statusCode} 200: OK, 404: session not found(or expired)
 */
router.delete('/:sessionId', ctx => {
    if (ctx.sessionMap.delete(ctx.params.sessionId)) {
        ctx.status = 200;
    }
    else {
        ctx.status = 404;
    }
});

module.exports = router;

const request = (api, sendObj) => {
    if (!api) {
        throw new Error(`API cannot be empty!`);
    }
    return new Promise((resolve, reject) => {
        Request(api, {
            method: 'POST',
            body: sendObj,
            json: true,
        }, (err, res, body) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}


Scheduler.scheduleJob('find-expired-users', `${expiredMin} * * * *`, async () => {
    console.log(`Searching for expired users`);
    const expiredTime = Number(new Date()) - expiredMin * 60 * 1000;
    let rtn = new Set();

    // search all expired users
    for (const user of user_session.map) {
        if (user.endtime < expiredTime) {
            rtn.add(user);  // add a deep-copy object
        }
    }

    //const api = '';  //TODO:
    //const res = await request(api, [...rtn]);

    //if (res.statusCode === 200) {
        // delete from session map
        for (const user of rtn) {
            user_session.delete(user.sessionId);
        }
    //}
});