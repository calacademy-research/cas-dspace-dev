#!/usr/bin/env python

import codecs


import csv

# csv_input = 'metadata_good_subject.csv'


first = True
line=0
with open ('metadata_good_subject.csv',mode='w',encoding='utf-8') as csv_output_file:
    with open('metadata_bad_subject.csv',encoding='utf-8') as csv_input_file:
        csv_input = csv.reader(csv_input_file)
        csv_output = csv.writer(csv_output_file,quoting=csv.QUOTE_ALL)
        for cur_line in csv_input:

            # print len(cur_line)
            # for counter, item in enumerate(cur_line):
            #     print (counter,":",item)
            id=cur_line[0]
            subject = cur_line[15]
            orig = subject
            subject = subject.rstrip(";")
            subject = subject.lstrip(";")

            subject = subject.replace("; ","||")
            subject=subject.replace(";","||")

            # if (orig != subject):
            #     print ("Swapped subject:", subject)
            if ';' in subject:
                print ("Cur line still has semi",subject)
            # print orig
            csv_output.writerow([id,subject])
            line += 1
            # if line > 3:
            #     exit(0)



