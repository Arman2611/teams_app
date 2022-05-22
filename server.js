
async function startServer() {
	try {

		// Environment variables
		const dotenv = require('dotenv');
		dotenv.config({ path: './config.env' });

		// Sequelize configuration
		const sequelize = require('./src/config/connection')(process);

		// Models
		const { Team, Match, Score, Team_Matches } = require('./src/models/index')(sequelize);

		// Synchronization with database
		await sequelize.sync( {alter: true} );

		// Koa app
		const app = require('./app')(sequelize);
		
		// Start server
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			console.log(`Server working on port ${port}`)
		});

	} catch(err) {
		console.log(err)
		console.log('Server failed to start');
	}
};

startServer();