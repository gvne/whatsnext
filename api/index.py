import os
import json
# import boto3

import pywhatsnext


# dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
# table = dynamodb.Table(os.environ["DATABASE_TABLE"])
# DEFAULT_PAGE_LIMIT = 25  # default number of output per page when listing

# def handle_list(event):
#     """
#     List available items
#     """
#     source_url = get_source_url(event)
#     # find if we have a page information
#     limit = DEFAULT_PAGE_LIMIT
#     offset = None
#     if event['queryStringParameters']:
#         if "limit" in event['queryStringParameters'].keys():
#             limit = int(event['queryStringParameters']['limit'])
#         if "offset" in event['queryStringParameters'].keys():
#             offset = str(event['queryStringParameters']['offset'])
#
#     # scan according to the parameters
#     if not offset:
#         response = table.scan(Limit=limit)
#     else:
#         response = table.scan(Limit=limit, ExclusiveStartKey={'id': offset})
#     raise_for_response(response)
#
#     # find required parts
#     # -- result
#     items = []
#     if "Items" in response.keys():
#         items = response['Items']
#
#     # -- last key to get next page
#     next = None
#     if "LastEvaluatedKey" in response.keys():
#         last_key = response['LastEvaluatedKey']['id']
#         next = source_url + "?limit=" + str(limit) + "&offset=" + last_key
#
#     # -- count
#     count = response['Count']
#
#     return {
#         "count": count,
#         "next": next,
#         "results": items
#     }, 200

def get_playlist_details(playlist_id):
    """
    Return playlist details
    """
    try:
        playlist = pywhatsnext.Playlist.from_id(playlist_id)
        return playlist.to_dict(), 200
    except pywhatsnext.NotFoundException:
        return {"message": "Not found"}, 404

def create_playlist():
    """
    Make a new playlist
    """
    playlist = pywhatsnext.Playlist()
    playlist.save()
    return playlist.to_dict(), 201

def append_to_playlist(playlist_id, body):
    """
    Append a new song to a playlist
    """
    try:
        playlist = pywhatsnext.Playlist.from_id(playlist_id)
        song = pywhatsnext.Song.from_body(json.loads(body))
        playlist.append(song)
        playlist.save()
        return playlist.to_dict(), 200
    except pywhatsnext.NotFoundException:
        return {"message": "Not found"}, 404
    except json.decoder.JSONDecodeError:
        raise pywhatsnext.InvalidBody("Body does not seem to be a valid json")

def list_playlists():
    return "list_playlists Not implemented", 500

def playlist_to_next(playlist_id):
    """
    Change a playlist's current song to the next one
    """
    try:
        playlist = pywhatsnext.Playlist.from_id(playlist_id)
        playlist.next()
        playlist.save()
        return playlist.to_dict(), 200
    except pywhatsnext.NotFoundException:
        return {"message": "Not found"}, 404

def delete_playlist(playlist_id):
    try:
        playlist = pywhatsnext.Playlist.from_id(playlist_id)
        playlist.delete()
        return "", 200
    except pywhatsnext.NotFoundException:
        return {"message": "Not found"}, 404

def handle_method(method, event):
    if method == "POST":
        if event['resource'] == "/v1/playlist/{playlistID}/next":
            return playlist_to_next(event['pathParameters']['playlistID'])
        return create_playlist()
    elif method == "GET":
        if event['pathParameters']:
            return get_playlist_details(event['pathParameters']['playlistID'])
        return list_playlists()
    elif method == "PUT":
        return append_to_playlist(event['pathParameters']['playlistID'],
                                  event['body'])
    elif method == "DELETE":
        return delete_playlist(event['pathParameters']['playlistID'])
    return "UNKNOWN METHOD", 500

def response(message, status_code):
    """
    Shape a valid http response from a message and status code
    """
    output = {
        'statusCode': str(status_code),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    if message:
        output['body'] = json.dumps(message)
    return output

def lambda_handler(event, context):
    try:
        method = event['httpMethod']
        body, code = handle_method(method, event)
        return response(body, code)
    except pywhatsnext.QueryException as e:
        return response(
            {'message': 'Error when querying the database'},
            e.status_code
        )
    except pywhatsnext.InvalidBody as e:
        return response(
            {'message': e.message},
            400
        )
    except Exception as e:
        return response(
            {'message': str(e)},
            500
        )
