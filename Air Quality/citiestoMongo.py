import pandas as pd 
import pymongo
import requests

cities = pd.read_csv('MNcities.csv')

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db = client.MNcitiesDB
db.breeze_info.drop()
breeze_info = db.breeze_info

for index, row in cities.iterrows():
    lat = row["lat"]
    lon = row["lng"]
    url = f"https://api.breezometer.com/air-quality/v2/current-conditions?lat={lat}&lon={lon}&key=b024607f571b48318956687919e6a8cd"
    features = "&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information"
    response = requests.get(url + features).json()
    
    try:
        poll_obj = {}

        info = {
             'city':row["city"],
             'latitude':lat,
             'longitude':lon,
             'population':row["population"],
            'aqi':response["data"]["indexes"]["baqi"]["aqi"],
             'color':response["data"]["indexes"]["baqi"]["color"],
             'category':response["data"]["indexes"]["baqi"]["category"],
             'pollutants':poll_obj,
             'general_rec':response["data"]["health_recommendations"]["general_population"]

        }
        breeze_info.insert_one(info)
    except:
        print(row["city"])