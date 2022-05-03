
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
	const Team = sequelize.define('Team', {
		team_id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		name:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		abbreviation:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		league:  {
			type: Sequelize.STRING,
			allowNull: false
		},
		date_of_foundation:  {
			type: Sequelize.DATE,
			allowNull: false
		},
		matches:  {
			type: Sequelize.JSON
		}
	}, {
		timestamps: false
	});
	
	return Team;
};