import csv
import ast
from prettytable import PrettyTable
from prettytable import TableStyle
from datetime import date, datetime

table = PrettyTable()

def get_vector_from_question(question_number, vector_name):
    string_vector = csv_reader_list[question_number][vector_name]
    python_vector = ast.literal_eval(string_vector)
    return(python_vector)

def get_total_attempts(question_number):
    return len(get_vector_from_question(question_number, 'code_vector'))

def get_days_since_last_attempt(question_number):
    date_vector = get_vector_from_question(question_number, 'date_vector')
    last_attempt_date = datetime.strptime(date_vector[-1], "%Y-%m-%d").date()
    today = date.today()
        # print(date_vector[1])
    print(last_attempt_date)
    # print(today)
    # print((today - last_attempt_date).days)
    
    return (today - last_attempt_date).days

with open('questions.csv', 'r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter='\t')
    csv_reader_list = list(csv_reader)

    # print(get_vector_from_question(3, 'code_vector'))
    # print(get_total_attempts(3))
    print(get_days_since_last_attempt(20));

    ## Generate Table ##
    table.field_names = ['Question number', "Days Since Last Attempt", "Total attempts"]


    for i in range(len(csv_reader_list)):
        table.add_row([i, get_days_since_last_attempt(i), get_total_attempts(i)])
        # print(f"{i+1}   {get_total_attempts(i)}")
    
    table.set_style(TableStyle.DOUBLE_BORDER)
    print(table)


    ## -------------- ##






# Example use
# print(get_vector_from_question(3, 'code_vector', csv_reader_list))





""" 
    with open('questions_formatted.csv', 'w', newline='') as new_csv_file:
        fieldnames = ['question_number','discipline','source','description','code_vector','date_vector']

        csv_writer = csv.DictWriter(new_csv_file, fieldnames=fieldnames, delimiter='\t')
        csv_writer.writeheader()

        for line in csv_reader:
            csv_writer.writerow(line)
 """