const Koa = require('koa');
const Logger = require('koa-logger');
const Bodyparser = require('koa-bodyparser');
const router = new (require('koa-router'));
const app = new Koa();
const rtSession = require('./router/session');
const port = Number(process.argv[2]) || 8080;

app.use(Logger());      // add logger to koa
app.use(Bodyparser());  // add body-parser to koa

router.use('/session', rtSession.routes());
app.use(router.routes());

app.listen(port, () => {
    console.log(`listening ${port}`);
});
