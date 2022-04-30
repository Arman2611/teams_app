
const { Sequelize, DataTypes } = require('sequelize');
const Match = require('./match');
const Score = require('./score');

module.exports = (sequelize) => {
	const MatchScores = sequelize.define('MatchScores', {
		MatchId: {
			type: DataTypes.INTEGER,
			references: {
				model: Match,
				key: 'id'
			}
		},
		Score: {
			type: DataTypes.INTEGER,
			references: {
				model: Score,
				key: 'id'
			}
		}
	}, {
		timestamps: false
	});

	Match.belongsToMany(Score, { through: MatchScores });
	Score.belongsToMany(Match, { through: MatchScores });

	return MatchScores;
};