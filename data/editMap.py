# -*- coding: utf-8 -*-
# python

# example of reading JSON from a file

import json
import csv

with open('un-map.json') as json_data:
    map_data = json.load(json_data)

c_data = {}
c_country_names = []

reader = csv.DictReader( open('countries.csv'))
for country in reader:
	c_data[country["country"]] = country
	c_country_names.append(country["country"])

#print (c_country_names)


map_countries = map_data["objects"]["TM_WORLD_BORDERS-0"]["geometries"]

m_data = []
m_country_names = []

for country in map_countries:
	m_data.append(country)
	m_country_names.append(country["properties"]["NAME"])

for country in m_data:
	con = country["properties"]["NAME"]
	if (con in c_country_names):
		cont = c_data[con]
		country["properties"]["REGION"] = cont["region"]
		country["properties"]["SUBREGION"] = cont["subregion"]
		country["properties"]["DEVELOPMENT"] = cont["development"]
		country["properties"]["INCOME"] = cont["income"]


map_data["objects"]["TM_WORLD_BORDERS-0"]["geometries"] = m_data

with open('data.json', 'w') as outfile:
    json.dump(map_data, outfile)
