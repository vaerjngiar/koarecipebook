const render = require('./lib/render');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const serve = require('koa-static');

const Koa = require('koa');
const app = module.exports = new Koa();

//manage static file
app.use(serve('./public'));

// "database"
const config = {
    user: 'eduonix',
    host: 'localhost',
    database: 'recipebook_db',
    password: '12345',
    port: 5432,
}


// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

// route definitions

router.get('/', list)
    .post('/add', create)
    .delete('/delete/:id', exclude)
    .post('/edit', edit);

app.use(router.routes());

//function
async function list (ctx) {
    await ctx.render('index', {})
}

async function create(ctx) {
    await ctx.render('index', {})
}

async function exclude(ctx) {
    await ctx.render('index', {})
}

async function edit(ctx) {
    await ctx.render('index', {})
}

//server

if (!module.parent) app.listen(3000, () =>{
    console.log('Server running at http://localhost:3000');
});