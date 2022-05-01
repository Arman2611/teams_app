
module.exports = (sequelize) => {

	const Router = require('koa-router');
	const router = new Router();

	// Controllers
	const matchController = require('../controllers/matchController')(sequelize);
	
	router
		.get('/matches', async (ctx, next) => {
			await matchController.getMatchesList(ctx, next);
		})
		.get('/matches/:match_id', async (ctx, next) => {
			await matchController.getMatchById(ctx, next);
		})
		.post('/matches', async (ctx, next) => {
			await matchController.createMatch(ctx, next);
		})
		.patch('/matches', async (ctx, next) => {
			await matchController.alterMatch(ctx, next);
		})
		.delete('/matches', async (ctx, next) => {
			await matchController.deleteMatch(ctx, next);
		});

	return router;
};
