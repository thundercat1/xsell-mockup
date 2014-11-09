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
    responseHeaders = {'Access-Control-Allow-Origin': '*'}
    try:
        query = request.args.get('query')
        if not query:
            return ('Request must provvide a search term', 400, responseHeaders)

        if query == 'undefined':
            return ('Do not make your request with "undefined" as the query', 400, responseHeaders)

        conn = httplib.HTTPConnection('www.backcountry.com')
        encoded_query = urllib.quote(query)
        conn.request('GET', '/v1/products?site=bcs&limit=3&metadata=false&q=' + encoded_query)
        res = conn.getresponse()
        data = res.read()


        if res.status == 200:
            return (data, 200, responseHeaders)

        else:
            return ('Product not found.' + str(res.status) + str(res.reason), 400, responseHeaders)
    except:
        return ('Error', 500, responseHeaders)


@app.route('/getStyle', methods=['GET'])
def getStyle():
    responseHeaders = {'Access-Control-Allow-Origin': '*'}
    try:
        style = request.args.get('style')

        if not style:
            return ('Request must provide a style argument', 400, responseHeaders)

        if style == 'undefined':
            return ('Do not make your request with "undefined" as the style', 400, responseHeaders)

        conn = httplib.HTTPConnection('www.backcountry.com')
        encoded_style = urllib.quote(style)

        conn.request('GET', '/v1/products/' + encoded_style + '?fields=id,skus.image.url,title,seoUrlToken,skus.url,brand')
        res = conn.getresponse()
        data = res.read()


        if res.status == 200:
            return (data, 200, responseHeaders)

        else:
            return ('Encountered error with product api.' + str(res.status) + str(res.reason), 400, responseHeaders)

    except:
        return ('Error', 500, responseHeaders)

if __name__ == '__main__':
    app.run(debug=True)
