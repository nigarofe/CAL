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


# Data Management
- To maintain a lightweight architecture while meeting modest performance goals, we persist all records in a single CSV file rather than using a full database.
- Since browsers cannot write directly to local files for security reasons, a minimal Node.js backend handles every CSV read/write operation. This backend is deliberately kept simple, exposing just two endpoints:
- GET /data: Reads the CSV file and returns the raw data to the client.
- POST /data: Receives updated data from the client and writes it back to the CSV file.

This design minimizes server-side complexity and usage, ensures secure file access, and keeps the overall system easy to maintain.





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
	- npm install express fs path cors
	- npm install -g nodemon
	
	- npm install dotenv
	- npm install @huggingface/inference
- Start server
	- nodemon server.js
	- node server.js

## CSV
- Separator
	- Tab = \t
- Encoding
	- UTF-8
























# File structure
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



# Design choices
This application design choices prioritize development simplicity.
Spending time making this application more secure or performing goes against this project's goals at this moment.

# Compartimentalization
The idea is to create black boxes: I shouldn't need to understand what each file of the code base does. I should actively hide what I'm not going to interact with so it doesn't load on my own working memory.





















# Performance Metrics Documentation

## Introduction

This interface offers a comprehensive view of your performance across various questions by displaying key metrics in a tabular format. All time-based metrics are expressed in days, similar to the DSLA metric. The table now includes the following columns:

- **Question Number**
- **Attempts Summary**
- **DSLA (Days Since Last Attempt)**
- **Longest Memory Interval (LMI) (Days)**
- **Latest Memory Interval (LaMI) (Days)**
- **Potential Memory Gain (Days) (PMG-D)**
- **Potential Memory Gain (%) (PMG-%)**

This guide explains the meaning, calculation, and examples for each column, helping you track your progress effectively.

---

## Column Explanations

### 1. Question Number

**Definition:**  
A unique identifier for each question.

**Purpose:**  
Simplifies referencing and tracking individual questions within the system.

---

### 2. Attempts Summary

**Definition:**  
A three-part summary, separated by semicolons (e.g., `4; 1; 3`), that details your attempts for a question.

**Components:**
- **Total Attempts (First Number):**  
  The overall number of attempts made.
- **Attempts from Memory (Second Number):**  
  Attempts completed solely from memory, without external assistance.
- **Attempts with Help (Third Number):**  
  Attempts where external help or references were used.

**Calculation:**  
`Total Attempts = Attempts from Memory + Attempts with Help`

**Example:**  
`4; 1; 3` means:
- 4 total attempts,
- 1 attempt solved from memory,
- 3 attempts with external help.

---

### 3. DSLA (Days Since Last Attempt)

**Definition:**  
The number of days that have passed since your most recent attempt on the question, irrespective of the method used.

**Purpose:**  
Indicates how recently you revisited the question.  
*(Like all the following time-based metrics, DSLA is expressed in days.)*

**Example:**  
A DSLA of `5` signifies that your last attempt was made 5 days ago.

---

### 4. Longest Memory Interval (LoMI) (Days)

**Definition:**  
The maximum number of days between any memory-based attempt and the attempt immediately preceding it (regardless of whether that preceding attempt was solved from memory or with help).

**Purpose:**  
Showcases your best long-term retention by indicating the longest period you maintained recall without needing reinforcement.  
*(This metric, like DSLA, is measured in days.)*

**Example:**  
If the longest gap between a memory-based attempt and its preceding attempt is 30 days, then the Longest Memory Interval is `30`.

---

### 5. Latest Memory Interval (LaMI) (Days)

**Definition:**  
The number of days between your most recent memory-based attempt and the previous attempt, calculated only if your latest attempt was solved from memory.

**Purpose:**  
Reflects your current retention capability by measuring the interval between your latest successful memory recall and the preceding attempt.  
*(This metric is expressed in days, similar to DSLA.)*

**Example:**  
If your latest memory-based attempt occurred 10 days after the previous attempt, then the Latest Memory Interval is `10`.

---

### 6. Potential Memory Gain (Days) (PMG-D)

**Definition:**  
The estimated improvement in your Latest Memory Interval, expressed in days, if you successfully answer the question from memory today.

**Calculation:**  
Days Increase = New Potential Interval (if solved from memory) – Current Latest Memory Interval

**Purpose:**  
Acts as a motivational metric, demonstrating the absolute benefit—in terms of days—of achieving another successful memory-based attempt.  
*(Just like DSLA, the value is expressed in days.)*

**Example:**  
If your current Latest Memory Interval is `10` days and a successful attempt today would result in a new interval of `13` days, the Potential Memory Gain (Days) is `3`.

---

### 7. Potential Memory Gain (%) (PMG-%)

**Definition:**  
The estimated improvement as a percentage, reflecting the proportional increase in your Latest Memory Interval if you answer the question from memory today.

**Calculation:**  
Percentage Increase = `(Days Increase / Current Latest Memory Interval) × 100%`

**Purpose:**  
Provides a relative metric that helps you understand the benefit of another successful memory-based attempt in percentage terms.

**Example:**  
Continuing the previous example, a 3-day gain on a 10-day interval results in a Potential Memory Gain of `(3 / 10) × 100% = 30%`.

---

## Conclusion

This updated documentation clarifies each performance metric with separate columns for DSLA, Longest Memory Interval, Latest Memory Interval, and the two components of Potential Memory Gain. Each of these time-based metrics is expressed in days, ensuring consistency and making it easier to compare and track your progress. Use these insights to identify areas for improvement and enhance your learning strategy and retention capabilities.
