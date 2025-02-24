import csv
import ast
from prettytable import PrettyTable
from prettytable import TableStyle

table = PrettyTable()

def get_vector_from_question(question_number, vector_name):
    string_vector = csv_reader_list[question_number-1][vector_name]
    python_vector = ast.literal_eval(string_vector)
    return(python_vector)

def get_total_attempts(question_number):
    return len(get_vector_from_question(question_number, 'code_vector'))

with open('questions.csv', 'r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter='\t')
    csv_reader_list = list(csv_reader)
    
    
    print(get_vector_from_question(3, 'code_vector'))
    print(get_total_attempts(3))

    table.field_names = ['Question number', "Total attempts"]
    for i in range(len(csv_reader_list)):
        table.add_row([i+1, get_total_attempts(i)])
        # print(f"{i+1}   {get_total_attempts(i)}")
    
    table.set_style(TableStyle.DOUBLE_BORDER)
    print(table)








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