# This code converts the delimiter of a .csv file from a comma (,) to a tab (   )
import csv

with open('questions.csv', 'r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)

    with open('questions_formatted.csv', 'w', newline='') as new_csv_file:
        fieldnames = ['question_number','discipline','source','description','code_vector','date_vector']

        csv_writer = csv.DictWriter(new_csv_file, fieldnames=fieldnames, delimiter='\t')
        csv_writer.writeheader()

        for line in csv_reader:
            csv_writer.writerow(line)