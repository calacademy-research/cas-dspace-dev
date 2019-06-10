#!/usr/bin/env python
import json
import os

def load_json_dictionary(filename):
    json_file = open(filename)
    json_str = json_file.read()
    json_data = json.loads(json_str)
    return json_data

# def parse_directory_name(string):
#     string = string.replace('\\', '/')
#     string = string.replace('cumulus/Cumulus/', '')
#     return string

# def build_path(cur_item):
#     directory = parse_directory_name(cur_item["Directory Path"])
#     path =  directory + "/" + cur_item["Filename"]
#     return path

def make_collection_dir(target_directory,collection):
    if not os.path.isdir(target_directory):
        os.mkdir(target_directory)
    if not os.path.isdir(target_directory+"/"+collection):
        os.mkdir(target_directory+"/"+collection)

def create_contents_file(path,filename):
    with open(path+"/contents",'w') as contents_file:
        contents_file.write(filename+"\n")

def create_collections_file(path,collection_name):
    with open(path+"/collections",'w') as collections_file:
        collections_file.write(collection_name+"\n")


# <dublin_core>
#     <dcvalue element="title" qualifier="none">A Tale of Two Cities</dcvalue>
#     <dcvalue element="date" qualifier="issued">1990</dcvalue>
#     <dcvalue element="title" qualifier="alternative" language="fr">J'aime les Printemps</dcvalue>
# </dublin_core>

# Collection,dc.identifier (other),Already exists in Cumulus
# Date Created,dc.date (created)
# Rights Holder,dc.rightsHolder
# Title,dc.title
# Creator,dc.creator
# Physical Format - was original format,dc.format
# Geographic Location (was Coverage Geographic),dc.coverage (spatial)
# Subject,dc.subject
# Asset Creation Date,dc.date (created)
# ID,dc.identifier
# Description,dc.description

def generate_dcvalue(collections_file,element_name,qualifier,key,record):
    if key in record:
        payload = record[key]
        if '&' in payload:
#	    print ("Found amp:",payload)
	    #payload.replace("&","&amp;")
            payload = payload.decode('quopri').decode('utf-8').replace('&', '&amp;')
#            print ("replaced amp:",payload)
        retval = "    <dcvalue element=\""
        retval = retval + element_name + "\" qualifier=\""
        retval = retval + qualifier + "\">"
        retval = retval + payload + "</dcvalue>\n"
        try:
            collections_file.write(retval.encode('utf8'))
        except Exception as e:
            print ("error:",e, "record id:",record["ID"])

def create_dublin_core_metadata(path,record):
    with open(path+"/dublin_core.xml",'w') as collections_file:
        collections_file.write("<dublin_core>"+"\n")
	    generate_dcvalue(collections_file,"title","none","Title",record)
        generate_dcvalue(collections_file,"date","none","Date Created",record)
        generate_dcvalue(collections_file,"identifier","other","Collection",record)
        generate_dcvalue(collections_file,"rights","holder","Rights Holder",record)
        generate_dcvalue(collections_file,"creator","none","Creator",record)
        generate_dcvalue(collections_file,"format","none","Physical Format",record)
        generate_dcvalue(collections_file,"coverage","spatial","Geographic Location",record)
        generate_dcvalue(collections_file,"subject","none","Subject",record)
        generate_dcvalue(collections_file,"date","created","Asset Creation Date",record)
        # generate_dcvalue(collections_file,"identifier","none","ID",record)
        generate_dcvalue(collections_file,"description","none","Description",record)
        collections_file.write("</dublin_core>"+"\n")

def generate_file_path(cumulus_root,record):
    return cumulus_root + "/" + record["Directory Path"] + "/" + record["Filename"]


def link_files(cumulus_root,path,record):
    full_file_path = generate_file_path(cumulus_root,record)
    if not os.path.isfile(path+"/"+record["Filename"]):
        os.symlink(full_file_path,path+"/"+record["Filename"])


def process_missing_file(record):
    items = []

    for tuple in record:
        items.append(record[tuple])
    #print "\t".join(items)
    try:
    	print unicode("\t", "utf-8").join(items)
    except Exception as e:
        print ("error:",e, record)

    #print unicode("\t", "utf-8").join(items)


def iterate_dictionary(dictionary):
    target_directory = "."
    collection = "cumulus"
    make_collection_dir(target_directory,collection)
    print ("Date Created,Asset Creation Date,Creator,Directory Path,Rights Holder,Collection,Filename,Geographic Location,ID,Subject")
    for id in dictionary:
        # {u'Date Created': u'',
        #  u'Asset Creation Date': u'2009-07-13T11:45:48-07:00',
        #  u'Creator': u'',
        #  u'Directory Path': u'cumulus\\Cumulus\\Manuscript_collections\\Eastwood_Alice',
        #  u'Title': u'Alice Eastwood in Herbarium',
        #  u'Rights Holder': u'Unknown', u'Collection': u'Eastwood, Alice',
        #  u'Filename': u'AE0078.tif',
        #  u'Geographic Location': u'California Academy of Sciences',
        #  u'ID': u'1889',
        #  u'Subject': u'Eastwood, Alice, 1859-1953; Portraits'}

        cur_item = dictionary[id]
	if True:
#        if "Drewes_Robert_C" in cur_item["Directory Path"]:
            path_to_top_level =  "/home/ibss-assets/Cumulus_backup"
            full_file_path = generate_file_path(path_to_top_level,cur_item)
            if not os.path.isfile(full_file_path):
#                 print ("****** missing file:",full_file_path)
                process_missing_file(cur_item)
            else:
                target_path =target_directory+"/"+collection + "/" + "item_" + id
                if not os.path.isdir(target_path):
                    os.mkdir(target_path)
                create_contents_file(target_path,cur_item["Filename"])
                create_collections_file(target_path,"Library Image Gallery")
                create_dublin_core_metadata(target_path,cur_item)
                link_files(path_to_top_level,target_path,cur_item)



dictionary = load_json_dictionary('intermediate.json')
iterate_dictionary(dictionary)
