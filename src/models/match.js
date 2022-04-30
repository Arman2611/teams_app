
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Match = sequelize.define('Match', {
		stadium: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: false
	});
	return Match;
};