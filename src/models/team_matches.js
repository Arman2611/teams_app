
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {

	const Team_Matches = sequelize.define('Team_Matches', {
		team_matches_id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		team_id: {
			type: Sequelize.UUID,
			references: {
				model: 'Teams',
				key: 'team_id'
			}
		},
		match_id: {
			type: Sequelize.UUID,
			references: {
				model: 'Teams',
				key: 'team_id'
			}
		},
	});
	
	return Team_Matches;
};