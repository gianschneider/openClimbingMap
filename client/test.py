import requests

# url = 'http://localhost:8080/geoserver/sf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sf%3Abugsites&maxFeatures=50&outputFormat=application%2Fjson'
url = 'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3AKlettergebiete&outputFormat=application%2Fjson'

response = requests.get(url)

if response.ok:
    try:
        data = response.json()

        print("Success! Number of features:", len(data['features']))
    except ValueError:
        print("Response JSON:", response.text)
        print("Error: Response is not valid JSON")
else:
    print("Error:", response.status_code)
    print("Response text:", response.text)
