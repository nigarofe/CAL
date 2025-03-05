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
