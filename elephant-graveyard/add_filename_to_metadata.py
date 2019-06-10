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
            bitstream = cur_line[10]
            filename = None
            try:
                search_string = 'No. of bitstreams: 1\n'
                index = bitstream.index(search_string) + len(search_string)
                filename = bitstream[index:].split(':')[0]
                print (filename)

            except:
                print ("No information: " + bitstream)
                continue




            # print orig
            csv_output.writerow([id,filename])
            line += 1
            # if line > 3:
            #     exit(0)



