import csv
import os
from datetime import datetime
from ast import literal_eval

CSV_FILENAME = 'questions.csv'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

class Question:
    def __init__(self, number, discipline, source, description, code_vector, date_vector):
        self.number = number
        self.discipline = discipline
        self.source = source
        self.description = description
        self.code_vector = code_vector
        self.date_vector = date_vector

    def to_list(self):
        return [
            self.number,
            self.discipline,
            self.source,
            self.description,
            str(self.code_vector),
            str(self.date_vector)
        ]

    def __str__(self):
        return (f"Question {self.number}:\n"
                f"  Discipline: {self.discipline}\n"
                f"  Source: {self.source}\n"
                f"  Description: {self.description}\n"
                f"  Code Vector: {self.code_vector}\n"
                f"  Date Vector: {self.date_vector}")

def validate_code_vector(code_vector):
    """Ensure all elements in code_vector are 0 or 1."""
    return all(isinstance(x, int) and x in (0, 1) for x in code_vector)

def validate_date_vector(date_vector):
    """Ensure all elements in date_vector are valid ISO dates."""
    try:
        for date in date_vector:
            datetime.strptime(date, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def load_questions():
    questions = []
    numbers_seen = set()
    if os.path.exists(CSV_FILENAME):
        with open(CSV_FILENAME, mode='r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            first_line = next(reader, None)
            expected_header = ["number", "discipline", "source", "description", "code_vector", "date_vector"]

            if first_line is None:
                return questions

            if first_line == expected_header:
                pass
            else:
                if len(first_line) >= 6:
                    try:
                        number = int(first_line[0])
                        if number in numbers_seen:
                            print(f"Warning: Duplicate question number {number} in first line. Skipping.")
                        else:
                            discipline = first_line[1]
                            source = first_line[2]
                            description = first_line[3]
                            code_vector = [int(x) for x in literal_eval(first_line[4])]
                            date_vector = literal_eval(first_line[5])
                            if (len(code_vector) == len(date_vector) and
                                validate_code_vector(code_vector) and
                                validate_date_vector(date_vector)):
                                questions.append(
                                    Question(number, discipline, source, description, code_vector, date_vector)
                                )
                                numbers_seen.add(number)
                            else:
                                print(f"Warning: Invalid data for question {number} in first line. Skipping.")
                    except Exception as e:
                        print("Error loading a question from CSV (first line):", e)

            for row in reader:
                if len(row) < 6:
                    continue
                try:
                    number = int(row[0])
                    if number in numbers_seen:
                        print(f"Warning: Duplicate question number {number}. Skipping.")
                        continue
                    discipline = row[1]
                    source = row[2]
                    description = row[3]
                    code_vector = [int(x) for x in literal_eval(row[4])]
                    date_vector = literal_eval(row[5])
                    if (len(code_vector) != len(date_vector) or
                        not validate_code_vector(code_vector) or
                        not validate_date_vector(date_vector)):
                        print(f"Warning: Invalid data for question {number}. Skipping.")
                        continue
                    questions.append(
                        Question(number, discipline, source, description, code_vector, date_vector)
                    )
                    numbers_seen.add(number)
                except Exception as e:
                    print("Error loading a question from CSV:", e)
    return questions

def save_all_questions(questions):
    header = ["number", "discipline", "source", "description", "code_vector", "date_vector"]
    try:
        with open(CSV_FILENAME, mode='w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(header)
            for q in questions:
                writer.writerow(q.to_list())
    except Exception as e:
        print("Error saving to CSV:", e)

def create_question(questions, next_question_number):
    clear_screen()
    print("Creating a new question:")
    discipline = input("Enter discipline: ").strip()
    while not discipline:
        print("Discipline cannot be empty.")
        discipline = input("Enter discipline: ").strip()
    source = input("Enter source: ").strip() or ""
    description = input("Enter description: ").strip()
    while not description:
        print("Description cannot be empty.")
        description = input("Enter description: ").strip()

    code_vector = []
    date_vector = []
    
    new_question = Question(next_question_number, discipline, source, description, code_vector, date_vector)
    questions.append(new_question)
    save_all_questions(questions)
    print("Question created and saved successfully!")
    input("Press Enter to continue...")
    return new_question

def see_question(questions):
    clear_screen()
    if not questions:
        print("No questions available.")
        input("Press Enter to continue...")
        return

    print("Available question numbers:")
    for q in questions:
        print(q.number, end="  ")
    print()
    
    try:
        q_number = int(input("Enter the question number to view: "))
    except ValueError:
        print("Invalid number.")
        input("Press Enter to continue...")
        return

    for q in questions:
        if q.number == q_number:
            print("\n" + str(q))
            input("Press Enter to continue...")
            return
    print("Question not found.")
    input("Press Enter to continue...")

def list_questions(questions):
    clear_screen()
    if not questions:
        print("No questions available.")
        input("Press Enter to continue...")
        return

    headers = [
        "Question #",
        "Days Since Last Attempt",
        "Last Attempt Was Without Help",
        "# of Total Attempts",
        "# Attempts Without Help",
        "# Attempts With Help"
    ]
    
    table = []
    today_date = datetime.now().date()
    for q in questions:
        if q.date_vector:
            last_date = datetime.strptime(q.date_vector[-1], "%Y-%m-%d").date()
            days_since = (today_date - last_date).days if last_date <= today_date else "N/A"
            last_without_help = "Yes" if q.code_vector[-1] == 1 else "No" if days_since != "N/A" else "N/A"
        else:
            days_since = "N/A"
            last_without_help = "N/A"
        
        total_attempts = len(q.code_vector)
        attempts_without_help = q.code_vector.count(1)
        attempts_with_help = q.code_vector.count(0)
        
        table.append([q.number, days_since, last_without_help, total_attempts, attempts_without_help, attempts_with_help])
    
    col_widths = [max(len(str(row[i])) for row in ([headers] + table)) + 2 for i in range(len(headers))]

    def print_row(row):
        print("".join(str(item).ljust(col_widths[i]) for i, item in enumerate(row)))
    
    print_row(headers)
    print("-" * sum(col_widths))
    for row in table:
        print_row(row)
        
    input("\nPress Enter to continue...")

def show_help():
    clear_screen()
    print("Help Information:")
    print("  Code Vector Explanation:")
    print("    - Code 0: I solved the question, but with help.")
    print("    - Code 1: I solved the question without any help.")
    print("\nNote: When creating a question, the code vector starts blank. Later, use the 'Register Question Completion' option")
    print("to add a daily code along with the current date (in ISO format YYYY-MM-DD).")
    input("\nPress Enter to return to the menu...")

def register_question_completion(questions):
    clear_screen()
    if not questions:
        print("No questions available to update.")
        input("Press Enter to continue...")
        return

    print("Register Completion for a Question")
    print("Available question numbers:")
    for q in questions:
        print(q.number, end="  ")
    print()
    
    try:
        q_number = int(input("Enter the question number you want to update: "))
    except ValueError:
        print("Invalid number.")
        input("Press Enter to continue...")
        return

    selected_question = None
    for q in questions:
        if q.number == q_number:
            selected_question = q
            break

    if not selected_question:
        print("Question not found.")
        input("Press Enter to continue...")
        return

    clear_screen()
    print(f"Registering completion for Question {selected_question.number}")
    print("Choose the code for today:")
    print("  0: I solved the question, but with help.")
    print("  1: I solved the question without any help.")
    code_input = input("Enter the code (0 or 1): ").strip()

    if code_input not in ('0', '1'):
        print("Invalid code. Please enter either 0 or 1.")
        input("Press Enter to continue...")
        return

    code = int(code_input)
    today_date_str = datetime.now().strftime("%Y-%m-%d")
    selected_question.code_vector.append(code)
    selected_question.date_vector.append(today_date_str)
    save_all_questions(questions)
    print(f"Question {selected_question.number} updated successfully with code {code} for {today_date_str}.")
    input("Press Enter to continue...")

def menu():
    questions = load_questions()
    next_question_number = max((q.number for q in questions), default=0) + 1

    while True:
        clear_screen()
        print("Menu:")
        print("1. Create a question")
        print("2. See a question")
        print("3. List all questions")
        print("4. Register question completion")
        print("5. Help")
        print("6. Exit")
        choice = input("Enter your choice (1-6): ")

        if choice == '1':
            create_question(questions, next_question_number)
            next_question_number += 1
        elif choice == '2':
            see_question(questions)
        elif choice == '3':
            list_questions(questions)
        elif choice == '4':
            register_question_completion(questions)
        elif choice == '5':
            show_help()
        elif choice == '6':
            clear_screen()
            print("Exiting program.")
            break
        else:
            print("Invalid choice. Please select a valid option (1-6).")
            input("Press Enter to continue...")

if __name__ == '__main__':
    menu()