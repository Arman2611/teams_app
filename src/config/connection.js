
module.exports = (process) => {
	
	const {Sequelize, Model, DataTypes} = require('sequelize');

	// Create Sequelize instance for our database
	const sequelize = new Sequelize(
		process.env.DATABASE_NAME,
		process.env.USER_NAME,
		process.env.DATABASE_PASSWORD,{
			host: process.env.HOST,
			dialect: 'postgres',
			logging: false,
			timezone: '+00:00',
			define: {
				timestamps: false
			}
		},
	);

	return sequelize;
};