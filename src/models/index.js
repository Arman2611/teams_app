
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
	
	// Models
	const Team = require('./team')(sequelize);
	const Match = require('./match')(sequelize);
	const Score = require('./score')(sequelize);
	const Team_Matches = require('./team_matches')(sequelize);


	// Team <=> Match associations
	Team.belongsToMany(Match, {
		as: 'matches',
		through: Team_Matches,
		foreignKey: {
			name: 'team_id',
			type: Sequelize.UUID,
			allowNull: false,
			unique: true
		}
	});

	Match.belongsToMany(Team, {
		as: 'teams',
		through: Team_Matches,
		foreignKey: {
			name: 'match_id',
			type: Sequelize.UUID,
			allowNull: false,
			unique: true
		}
	});



	// Match <=> Score associations
	Match.hasOne(Score, {
		as: 'score',
		foreignKey: {
			name: 'match_id',
			type: Sequelize.UUID,
			allowNull: false,
			unique: true
		},
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	});

	Score.belongsTo(Match, {
		foreignKey: {
			name: 'match_id',
			type: Sequelize.UUID,
			allowNull: false,
			unique: true
		}
	});

	return { Team, Match, Score, Team_Matches }
}