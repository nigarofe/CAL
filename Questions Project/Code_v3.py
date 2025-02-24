import csv
import ast
from prettytable import PrettyTable
from prettytable import TableStyle
from datetime import date, datetime

table = PrettyTable()
today = date.today()

def get_vector_from_question(question_number, vector_name):
    string_vector = csv_reader_list[question_number][vector_name]
    python_vector = ast.literal_eval(string_vector)
    return(python_vector)

def get_total_attempts(question_number):
    return len(get_vector_from_question(question_number, 'code_vector'))

def get_days_since_last_attempt(question_number):
    date_vector = get_vector_from_question(question_number, 'date_vector')
    last_attempt_date = datetime.strptime(date_vector[-1], "%Y-%m-%d").date()
        # print(date_vector[1])
    # print(last_attempt_date)
    # print(today)
    # print((today - last_attempt_date).days)
    
    return (today - last_attempt_date).days

def get_all_time_record(question_number):
    code_vector = get_vector_from_question(question_number, 'code_vector')
    date_vector = get_vector_from_question(question_number, 'date_vector')
    
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

def get_current_record(question_number):
    code_vector = get_vector_from_question(question_number, 'code_vector')
    date_vector = get_vector_from_question(question_number, 'date_vector')

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

def get_last_attempt_was_without_help(question_number):
    code_vector = get_vector_from_question(question_number, 'code_vector')
    if code_vector[-1] == 1:
        return "Yes"
    else:
        return "No"

def get_todays_potential_record_increase(question_number):
    get_days_since_last_attempt(question_number)


with open('questions.csv', 'r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter='\t')
    csv_reader_list = list(csv_reader)

    # print(get_vector_from_question(3, 'code_vector'))
    # print(get_total_attempts(3))
    # print(get_days_since_last_attempt(20))
    # print(get_record_report(0))

    ## Generate Table ##
    table.field_names = ['Question number', "Days Since Last Attempt", "All time record without help", "Current record", "Total attempts", "Last attempt was without help"]


    for i in range(len(csv_reader_list)):
        table.add_row([i, get_days_since_last_attempt(i), get_all_time_record(i),  get_current_record(i), get_total_attempts(i), get_last_attempt_was_without_help(i)])
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