"""
What to do next
Rewrite the code in a way that there's only 1 matrix to store all the data

print("=== Main menu ===")
print("1. List all questions")
print("2. Register question completion")
print("3. Create a question")
print("5. Help")
print("6. Exit")

print("== Questions listing menu ==")
print("Order questions by)
print(1 Question number)
print(2 Days since last attempt)
print(3 Potential new record increase)
"""


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
