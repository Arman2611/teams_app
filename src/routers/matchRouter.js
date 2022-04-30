
const Router = require('koa-router');
const router = new Router();

// Controllers
// const matchController = require('../controllers/matchController')(sequelize);

router
	.get('/matches', (ctx, next) => {
		ctx.body = 'You should get all matches list'
	})
	.post('/matches', (ctx, next) => {
		ctx.body = 'You should add new match'
	})
	.put('/matches', (ctx, next) => {
		ctx.body = 'You should change match data'
	})
	.delete('/matches', (ctx, next) => {
		ctx.body = 'You should delete a match'
	});


module.exports = (sequelize) => {
	return router;
};