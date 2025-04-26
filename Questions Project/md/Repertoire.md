 
# Ideas
## CSV file
- Question number
	- #
	- 1, 2, 3, ...
- Question pool status
	- Too ahead from the content I'm viewing
	- Never tried to solve
	- Good to solve
	-  

## List
- Make table update smoother
- Add question
- Filters
- Time slider (In a way that I can see the table as if I were 10 days on the past, 12 days, etc), so I can get a better grasp of my progress
- User preferences (autoSaveEnabled, displayOptions, etc) on the .csv
- Separate script.js and server.js in a way that the processing of the .csv is made entirely server.js. 
- Log of questions attempted
- PMG-X probability distribution: what PMG-X I have a chance of k% of improving my LaMI?
- When my yesterday's attempt was with help, it's probably a good idea to try it again today
- Questions that I attempted yesterday and could only do with help are of the utmost priority
- There are some questions that are pre-requisite to others. Make something to let this be clear, so I don't try to do something before the pre-requisite also being done that day?
- Column of question in latex and llm output. Repeatable adn beautiful
- Obsidian vault data scraper to use with LLM
- Create column in the .csv to implement MIG data selection ([[r0 Video Introduction of MIG]])



## Tech Stack / Requirements
- npm 10.9.2

- CSS
- HTML
	- Bootstrap 5.3.5
- JavaScript
	- Node.js 22.14.0
- Katex 0.16.22
- csv-stringify 6.5.2

### Useful commands
- See if is installed correctly
	- npm -v
	- node -v
- Start Node.js project in folder
	- npm init -y
- Install 
	- npm i csv-stringify
	- npm i bootstrap
	- npm i katex
	- npm install express fs path cors
	- npm install -g nodemon
- Start server
	- nodemon server.js
	- node server.js

## CSV
- Separator
	- Tab = \t
- Encoding
	- UTF-8


