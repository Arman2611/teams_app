
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Score = sequelize.define('Score', {
		homeTeamGoals: {
			type: DataTypes.INTEGER
		},
		awayTeamGoals: {
			type: DataTypes.INTEGER
		},
	}, {
		timestamps: false
	});
	return Score;
};