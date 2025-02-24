import csv
import ast
from prettytable import PrettyTable
from prettytable import TableStyle
from datetime import date, datetime
import math


table = PrettyTable()
today = date.today()

def get_vector_from_question(q_number, vector_name):
    string_vector = csv_reader_list[q_number][vector_name]
    python_vector = ast.literal_eval(string_vector)
    return(python_vector)

def get_total_attempts(q_number):
    return len(get_vector_from_question(q_number, 'code_vector'))

def get_days_since_last_attempt(q_number):
    date_vector = get_vector_from_question(q_number, 'date_vector')
    last_attempt_date = datetime.strptime(date_vector[-1], "%Y-%m-%d").date()
        # print(date_vector[1])
    # print(last_attempt_date)
    # print(today)
    # print((today - last_attempt_date).days)
    
    return (today - last_attempt_date).days

def get_all_time_record(q_number):
    code_vector = get_vector_from_question(q_number, 'code_vector')
    date_vector = get_vector_from_question(q_number, 'date_vector')
    
    all_time_record = 0    
    for i in range(1, len(code_vector)):
        if code_vector[i] == 1 and code_vector[i-1] == 1:
            first_success_day = datetime.strptime(date_vector[i-1], "%Y-%m-%d").date()
            second_success_day = datetime.strptime(date_vector[i], "%Y-%m-%d").date()
            days_interval = (second_success_day - first_success_day).days
            #print (days_interval)
            if days_interval > all_time_record:
                all_time_record = days_interval
    return all_time_record

def get_current_record(q_number):
    code_vector = get_vector_from_question(q_number, 'code_vector')
    date_vector = get_vector_from_question(q_number, 'date_vector')

    current_record = 0
    for i in range(len(code_vector)-1, 0, -1):
        # print(f"{i=}")
        # Check if I got it wrong when I was trying to beat my record
        # If that's the case, my current record is 0
        if code_vector[i] == 0 or code_vector[i-1] == 0:
            break;
        elif code_vector[i] == 1 and code_vector[i-1] == 1:
            first_success_day = datetime.strptime(date_vector[i-1], "%Y-%m-%d").date()
            second_success_day = datetime.strptime(date_vector[i], "%Y-%m-%d").date()
            days_interval = (second_success_day - first_success_day).days
            # print(first_success_day)
            # print(second_success_day)
            # print(days_interval)
            current_record = days_interval;
            break
    return current_record

def last_attempt_was_without_help(q_number):
    code_vector = get_vector_from_question(q_number, 'code_vector')
    if code_vector[-1] == 1:
        return "Yes"
    else:
        return "No"

def get_potential_record_increase(q_number):
    if(last_attempt_was_without_help(q_number) == "Yes"):
        current_all_time_record = get_all_time_record(q_number)
        days_since_last_attempt = get_days_since_last_attempt(q_number)
        
        return days_since_last_attempt - current_all_time_record
    else:
        return math.inf


with open('questions.csv', 'r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter='\t')
    csv_reader_list = list(csv_reader)

    # print(get_vector_from_question(3, 'code_vector'))
    # print(get_total_attempts(3))
    # print(get_days_since_last_attempt(20))
    # print(get_record_report(0))
    # print(get_potential_record_increase(5))

    ## Generate Table ##
    table.field_names = ['Question number', "Attempts", "Records"]
    table.add_row(['','Days Since Last attempt','All time record without help'])
    table.add_row(['','Total attempts','Current record'])
    table.add_row(['','Last attempt was without help','Potential new record increase'])
    table.add_divider();
    

    for i in range(len(csv_reader_list)):
        table.add_row([i, [get_days_since_last_attempt(i), get_total_attempts(i), last_attempt_was_without_help(i)], [get_all_time_record(i),  get_current_record(i), get_potential_record_increase(i)]])
        # print(f"{i+1}   {get_total_attempts(i)}")
    
    table.set_style(TableStyle.DOUBLE_BORDER)
    print(table)




    ## -------------- ##






# Example use
# print(get_vector_from_question(3, 'code_vector', csv_reader_list))





""" 
    with open('questions_formatted.csv', 'w', newline='') as new_csv_file:
        fieldnames = ['q_number','discipline','source','description','code_vector','date_vector']

        csv_writer = csv.DictWriter(new_csv_file, fieldnames=fieldnames, delimiter='\t')
        csv_writer.writeheader()

        for line in csv_reader:
            csv_writer.writerow(line)
 """