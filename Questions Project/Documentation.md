# Performance Metrics Documentation

## Introduction

This interface offers a comprehensive view of your performance across various questions by displaying key metrics in a tabular format. The table includes the following columns:

- **Question Number**
- **Attempts Summary**
- **DSLA (Days Since Last Attempt)**
- **From Memory Summary**

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

### 3. Days Since Last Attempt (DSLA)

**Definition:**  
The number of days that have passed since your most recent attempt on the question, irrespective of the method used.

**Purpose:**  
Indicates how recently you revisited the question.

**Example:**  
A DSLA of `5` signifies that your last attempt was made 5 days ago.

---

### 4. From Memory Summary

This section is divided into three parts, each highlighting a different aspect of your memory performance.

#### A. Longest Memory Interval

- **Definition:**  
  The maximum number of days between any memory-based attempt and the attempt immediately preceding it (regardless of whether that preceding attempt was solved from memory or with help).

- **Purpose:**  
  Showcases your best long-term retention by indicating the longest period you maintained recall without needing reinforcement.

#### B. Latest Memory Interval

- **Definition:**  
  The number of days between your most recent memory-based attempt and the previous attempt, calculated only if your latest attempt was solved from memory.

- **Purpose:**  
  Reflects your current retention capability by measuring the interval between your latest successful memory recall and the preceding attempt.

#### C. Potential Memory Gain (% and Days)

- **Definition:**  
  The estimated improvement in your Latest Memory Interval if you successfully answer the question from memory today.

- **Calculation:**  
  - **Days Increase:**  
    The difference between the new potential interval (if solved from memory) and your current Latest Memory Interval.
  - **Percentage Increase:**  
    The proportional gain calculated as:  
    `(Days Increase / Current Latest Memory Interval) × 100%`

- **Purpose:**  
  Acts as a motivational metric, demonstrating the potential benefits—both in absolute days and percentage terms—of achieving another successful memory-based attempt.

---

## Conclusion

This documentation is designed to clarify each performance metric, empowering you to identify areas for improvement and monitor your progress over time. Use these insights to enhance your learning strategy and retention capabilities.
