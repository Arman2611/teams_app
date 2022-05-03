# teams_app
A simple API for sport teams. teams_app is developed on Node.js, using koa.js framework and PostgreSQL database

# Installation
1) Install all required dependencies by using the ```npm install``` command

	```
	$ npm install
	```
2) Run the server by using the ```node server.js``` command

	```
	$ node server.js
	```

# API
teams_app provides API for doing CRUD operations with teams and matches

	[GET]		/teams			=>	get all teams list (accepts query string)
	[GET]		/teams/:team_id		=>	get a team data
	[POST]   	/teams			=>	create a team
	[PATCH]		/teams			=>	edit a team data
	[DELETE]	/teams			=>	delete a team

	[GET]		/matches		=>	get all matches list
	[GET]		/matches/:match_id	=>	get a match data
	[POST]   	/matches		=>	create a match
	[PATCH]*	/matches		=>	edit a match data
	[DELETE]	/matches		=>	delete a match

# Information
1) this app includes a Postman collection in ```/src/utils``` folder for all CRUD operations.

# Warning
1) any [PATCH] request to the ```/matches``` route with ```score_id``` property in request body is considered as request for editing only the match score. Avoid using ```score_id``` property if you want to change another data.