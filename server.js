
async function startServer() {
	try {

		// Environment variables
		const dotenv = require('dotenv');
		dotenv.config({ path: './config.env' });

		const {Sequelize, Model, DataTypes} = require('sequelize');

		// create Sequelize instance for our database
		const sequelize = new Sequelize(
			process.env.DATABASE_NAME,
			process.env.USER_NAME,
			process.env.DATABASE_PASSWORD,{
				host: process.env.HOST,
				dialect: 'postgres',
				logging: false
			},
		);

		// Checking connection
		await sequelize.authenticate();

		// Koa app
		const app = require('./app')(sequelize);
		
		// start server
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