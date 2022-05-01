
module.exports = (sequelize) => {

	const Koa = require('koa');
	const bodyParser = require('koa-bodyparser');

	// Create app
	const app = new Koa();

	// Routers
	const teamRouter = require('./src/routers/teamRouter')(sequelize);
	const matchRouter = require('./src/routers/matchRouter')(sequelize);

	app
		.use(bodyParser())
		.use(teamRouter.routes())
		.use(teamRouter.allowedMethods())
		.use(matchRouter.routes())
		.use(matchRouter.allowedMethods())
	
	return app;
};