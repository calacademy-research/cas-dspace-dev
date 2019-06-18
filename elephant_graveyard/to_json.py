#!/usr/bin/env python
import os
import json,csv
import dateparser
import dateutil

# imput from


# Creator,  R. Van Syoc 02 Jun 1998,R.J. Van Syoc,6/2/98 0:00,,
def load_creator_corrections(corrections_file_name):
    field_to_correction = {}
    with open(corrections_file_name,'rU') as corrections_file:
        reader = csv.reader(corrections_file)
        for tuple in reader:

            bad_creator_field = tuple[1].strip()
            embedded_date_string = tuple[3].strip()
            good_creator_field = tuple[2].strip()

            field_to_correction[bad_creator_field]=[embedded_date_string,good_creator_field]
    return field_to_correction


def load_corrections(corrections_file_name):
    field_to_correction = {}

    with open(corrections_file_name,'r') as corrections_file:
        reader = csv.reader(corrections_file)
        try:
            for tuple in reader:

                field = tuple[0]
                from_text = tuple[1]
                to_text = tuple[2]
                if field not in field_to_correction:
                    field_to_correction[field] ={}
                bad_to_good = field_to_correction[field]
                bad_to_good[from_text] = to_text
        except csv.Error, e:
            sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))

    return field_to_correction


keep_fields = {'Collection': None,
               'Date Created': None,
               'Rights Holder': None,
               'Title': None,
               'Creator': None,
               'Original Format': 'Phyiscal Format',
               'Coverage Geographic': 'Geographic Location',
               'Subject': None,
               'Asset Creation Date': None,
               'ID': None,
               'Folder Name': 'Directory Path',
               'Asset Name': 'Filename'}


def correct(tuple, corrections,diagnose):
    if tuple[0] not in corrections:
        return tuple
    dict = corrections[tuple[0]]
    if tuple[1] in dict:
        if diagnose:
            print ("old: \'" + tuple[1]+"\'"),
        tuple[1] = dict[tuple[1]]
        if diagnose:
            print (" print: \'" + tuple[1]+"\'")
    # else:
    #     print ("ok: \'" + tuple[1]+"\'")


    return tuple



# def process_tuple(cur_line,corrections,creator_corrections,diagnose):
#     first_colon = cur_line.find(":")
#     tuple = []
#     tuple.append(cur_line[:first_colon].strip())
#     tuple.append(cur_line[first_colon + 1:].strip())
#     if diagnose:
#         print ("  processing: \'"+ tuple[0]+"\':"+ tuple[1]+"\'")
#     if tuple[0] in keep_fields:
#
#         lookup = keep_fields[tuple[0]]
#         if lookup is not None:
#             tuple[0] = lookup
#         corrected_tuple = correct(tuple, corrections,diagnose)
#         bad_field=None
#         if corrected_tuple[0].startswith("Creator"):
#             bad_field = corrected_tuple[1]
#             if(bad_field in creator_corrections):
#                 correction = creator_corrections[bad_field]
#
#                 print ("Found a bad 'un!",bad_field,correction)
#                 print "   ",tuple
#                 corrected_tuple[1] = correction[1]
#                 print "   corrected: ", corrected_tuple
#                 print "   creation date: ", correction[0]
#                 # date = dateparser.parse(tuple[1])
#                 # if date is not None:
#                 #     print date
#                 # else:
#                 #     print "No date here: " + tuple[1]
#
#         return corrected_tuple
#     else:
#         return None

def process_tuple(cur_line,diagnose):
    first_colon = cur_line.find(":")
    tuple = []
    tuple.append(cur_line[:first_colon].strip())
    tuple.append(cur_line[first_colon + 1:].strip())
    if diagnose:
        print ("  processing: \'"+ tuple[0]+"\':"+ tuple[1]+"\'")
    if tuple[0] in keep_fields:

        lookup = keep_fields[tuple[0]]
        if lookup is not None:
            tuple[0] = lookup


        return tuple
    else:
        return None



def correct_record(record,creator_corrections,corrections):
    for field_name in record:
        value = record[field_name]
        tuple = [field_name,value]
        corrected_tuple = correct(tuple, corrections,False)
        record[field_name] = corrected_tuple[1]
        value = corrected_tuple[1]

        if field_name.startswith("Creator"):

            if(value in creator_corrections):
                correction = creator_corrections[value]

                print ("Found a bad 'un!",value,correction)
                print "  ", "record id:",record['ID']
                record[field_name] = correction[1]
                record['Asset Creation Date']=correction[0]
    return record


creator_corrections = load_creator_corrections("fixed_creator.csv")
corrections = load_corrections("Data Cleanup for DAM.csv")
with open("intermediate_format.txt", 'r') as in_file, open("intermediate.json", 'w') as out_file:
    cur_record = {}
    output_dictionary = {}
    record_id = None
    diagnose=False
    for cur_line in in_file:
        # if cur_line.find("Drewes") > 0 and cur_line.find("Creator") > 0:
        #     diagnose=True
        #     print ("------------")
        #     print cur_line

        if cur_line.strip().startswith("----"):

            if record_id is not None:
                corrected_record = correct_record(cur_record,creator_corrections,corrections)
                output_dictionary[record_id] = corrected_record
                if diagnose:
                    print "*** adding record:" + str(record_id)
                    diagnose=False

                cur_record={}

            record_id = cur_line.split()[1]
        else:
            tuple = process_tuple(cur_line,diagnose)
            if tuple is not None:
                if diagnose:
                    print "*** adding line"
                cur_record[tuple[0]] = tuple[1]
    out_file.write(json.dumps(output_dictionary,indent=4))
