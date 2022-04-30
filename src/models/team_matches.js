
const { Sequelize, DataTypes } = require('sequelize');
const Team = require('./team');
const Match = require('./match');

module.exports = (sequelize) => {
	const TeamMatches = sequelize.define('TeamMatches', {
		TeamId: {
			type: DataTypes.INTEGER,
			references: {
				model: Team,
				key: 'id'
			}
		},
		MatchId: {
			type: DataTypes.INTEGER,
			references: {
				model: Match,
				key: 'id'
			}
		}
	}, {
		timestamps: false
	});

	Team.belongsToMany(Match, { through: TeamMatches });
	Match.belongsToMany(Team, { through: TeamMatches });

	return TeamMatches;
};