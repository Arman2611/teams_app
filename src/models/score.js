
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
	const Score = sequelize.define('Score', {
		score_id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		// match_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: false
		// },
		home_team_goals: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false
		},
		away_team_goals: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false
		}
	});

	return Score;
};