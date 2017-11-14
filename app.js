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
const { Pool } = require('pg');
const pool = new Pool(config);


// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

// route definitions

router.get('/', list)
    .post('/add', create)
    .del('/delete/:id', remove)
    .post('/edit', edit);

app.use(router.routes());

//function
async function list (ctx) {
    let result;
    const client = await pool.connect();
    try {
        result = await client.query('SELECT * FROM recipe as recipes');
        //console.log(result.rows[0]);

    } finally {
        client.release();
    }

    await ctx.render('index', {recipes: result.rows});
}

async function create(ctx) {

    const recipe = ctx.request.body;
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO recipe(name, ingredients, directions) VALUES ($1, $2, $3)',
            [recipe.name, recipe.ingredients, recipe.directions]);

    } finally {
        client.release();
    }

    await ctx.redirect('/');
}

async function remove(ctx) {

    const id = ctx.params.id;
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM recipe WHERE id = $1',[id]);

    } finally {
        client.release();
    }

    ctx.body = 'ok';
}

async function edit(ctx) {

    const recipe = ctx.request.body;
    const client = await pool.connect();
    try {
        await client.query('UPDATE recipe SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',
            [recipe.name, recipe.ingredients, recipe.directions, recipe.id]);

    } finally {
        client.release();
    }

    await ctx.redirect('/');
}

//server

if (!module.parent) app.listen(3000, () =>{
    console.log('Server running at http://localhost:3000');
});