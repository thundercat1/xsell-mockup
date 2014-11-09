#!flask/bin/python
from flask import Flask
from flask import request
import httplib, urllib

app = Flask(__name__)

@app.route('/')
def index():
    return 'Call the endpoint if you want something. Try ../getRecommendations?query="something"'

@app.route('/getRecommendations', methods = ['GET'])
def getRecommendations():
    query = request.args.get('query')

    if not query:
        return ('Please specify a query parameter, like: <br> ../getRecommendations?query="Jackets"', 400)

    conn = httplib.HTTPConnection('www.backcountry.com')
    encoded_query = urllib.quote(query)
    conn.request('GET', '/v1/products?site=bcs&limit=3&metadata=false&q=' + encoded_query)
    res = conn.getresponse()
    data = res.read()

    responseHeaders = {'Access-Control-Allow-Origin': '*'}

    if res.status == 200:
        return (data, 200, responseHeaders)

    else:
        return ('Encountered error with product api.' + res.status + res.reason, 400)


if __name__ == '__main__':
    app.run(debug=True)
