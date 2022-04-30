
module.exports = (sequelize) => {

	const Router = require('koa-router');
	const router = new Router();

	// Controllers
	const teamController = require('../controllers/teamController')(sequelize);
	
	router
		.get('/teams', async (ctx, next) => {
			await teamController.getTeamsList(ctx, next);
		})
		.get('/teams/:team_id', async (ctx, next) => {
			await teamController.getTeamById(ctx, next);
		})
		.post('/teams', async (ctx, next) => {
			await teamController.createTeam(ctx, next);
		})
		.patch('/teams', async (ctx, next) => {
			await teamController.alterTeam(ctx, next);
		})
		.delete('/teams', async (ctx, next) => {
			await teamController.deleteTeam(ctx, next);
		});

	return router
};