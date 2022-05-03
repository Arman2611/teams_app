
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
	const Match = sequelize.define('Match', {
		match_id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		home_team_id:  {
			type: Sequelize.UUID,
			allowNull: false
		},
		away_team_id:  {
			type: Sequelize.UUID,
			allowNull: false
		},
		score_id: {
			type: Sequelize.UUID,
			allowNull: true
		},
		home_team_name:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		away_team_name:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		match_status:  {
			type: Sequelize.STRING,
			defaultValue: 'forthcoming',
			allowNull: false
		},
		match_score:  {
			type: Sequelize.STRING,
			defaultValue: 'undefined'
		},
		stadium:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		date_of_match:  {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		timestamps: false
	});

	return Match;
};

// Match status _ forthcoming | ongoing | finished