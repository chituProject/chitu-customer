#!/usr/bin/python
#-*- coding:utf-8 -*-

import json

with open('../data/banks.txt', 'r') as f1:
    list1 = f1.readlines()
data = {}
for i in range(0, len(list1)):
    list1[i] = list1[i].rstrip('\n')
    ll = list1[i].split()
    data[ll[0]] = { "bank": ll[1], "type": ll[2] }
    print data[ll[0]]
# print data

f1.close()
json = json.dumps(data)
# print json

with open('../data/banks.json', 'w') as f2:
    f2.write(json)
f2.close()