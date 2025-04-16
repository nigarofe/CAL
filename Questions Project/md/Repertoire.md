# V3 ideas

## Tech Stack / Requirements
- npm 10.9.2

- HTML
- CSS
	- Bootstrap 5.3.5
- JavaScript
	- Node.js 22.14.0
- Katex 0.16.22
- csv-stringify 6.5.2

## Useful commands
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

# CSV
- Separator
	- Tab = \t
- Encoding
	- UTF-8

# Interface description
- There's only one screen
	- There's a centralized h1 title "Questions"
	- There's a search bar that search in regex across all table fields
- Clicking a row of the table opens a modal with the question
	- Modal structure
		- The modal header has a centralized h1 title "Question 42"
		- The model body has the following sections
			- Question statement
			- Question resolution by LLM
			- Question resolution by myself
			- Question answer
		- The model footer has a button tray aligned to the center with two buttons, named "0" and "1," , that when hovered display
			- "0 = I needed help to solve the question" 
			- "1 = I solved the question without any external help" 





# Repertoire of things 
Make table update smoother

Add question

Filters

Time slider (In a way that I can see the table as if I were 10 days on the past, 12 days, etc), so I can get a better grasp of my progress

User preferences (autoSaveEnabled, displayOptions, etc) on the .csv

Separate script.js and server.js in a way that the processing of the .csv is made entirely server.js. 

Log of questions attempted

PMG-X probability distribution: what PMG-X I have a chance of k% of improving my LaMI?

When my yesterday's attempt was with help, it's probably a good idea to try it again today

Questions that I attempted yesterday and could only do with help are of the utmost priority

There are some questions that are pre-requisite to others. Make something to let this be clear, so I don't try to do something before the pre-requisite also being done that day?



Column of question in latex and llm output. Repeatable adn beautiful
# Design choices
This application design choices prioritize development simplicity.
Spending time making this application more secure or performing goes against this project's goals at this moment.

## Compartimentalization
The idea is to create black boxes: I shouldn't need to understand what each file of the code base does. I should actively hide what I'm not going to interact with so it doesn't load on my own working memory.

## File structure
main.js
questions.csv
matrixManipulation.js

UI
    index.html
    style.css
    ui.js
Server
    server.js
    other node.js stuff
