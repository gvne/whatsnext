import os
import json
import boto3
import uuid

from exception import QueryException, InvalidBody
from utils import raise_for_response, get_status_code, get_source_url
from model import Playlist, Song


dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table(os.environ["DATABASE_TABLE"])
DEFAULT_PAGE_LIMIT = 25  # default number of output per page when listing

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
    response = table.get_item(Key={'id': playlist_id})
    raise_for_response(response)
    if not "Item" in response.keys():
        return {"message": "Not found"}, 404
    return response["Item"], get_status_code(response)

def create_playlist():
    """
    Make a new playlist
    """
    playlist = Playlist()
    playlist.id = str(uuid.uuid1())
    response = table.put_item(Item=playlist.to_dict())
    raise_for_response(response)

    item, _ = get_playlist_details(playlist.id)
    return item, 201

def append_to_playlist(playlist_id, body):
    """
    Append a new song to a playlist
    """
    playlist_dict, status_code = get_playlist_details(playlist_id)
    if status_code != 200:
        return playlist_dict, status_code

    try:
        json_body = json.loads(body)
    except:
        raise InvalidBody("Body is not a valid json")

    song = Song.from_body(json_body)
    song.id = str(uuid.uuid1())
    playlist = Playlist.from_body(playlist_dict)
    playlist.append_song(song)
    response = table.put_item(Item=playlist.to_dict())
    raise_for_response(response)

    item, status_code = get_playlist_details(playlist.id)
    if status_code == 200:
        status_code = 201
    return item, status_code

def list_playlists():
    return "list_playlists Not implemented", 500

def playlist_to_next(playlist_id):
    # get playlist
    playlist_dict, status_code = get_playlist_details(playlist_id)
    if status_code != 200:
        return playlist_dict, status_code
    playlist = Playlist.from_body(playlist_dict)

    # move to next
    playlist.next()

    # save playlist
    response = table.put_item(Item=playlist.to_dict())
    raise_for_response(response)

    item, status_code = get_playlist_details(playlist.id)
    if status_code == 200:
        status_code = 201
    return item, status_code

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
    return "UNKNOWN METHOD", 500

def response(message, status_code):
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
    except QueryException as e:
        return response(
            {'message': 'Error when querying the database'},
            e.status_code
        )
    except InvalidBody as e:
        return response({'message': e.message}, 400)
    except Exception as e:
        return response({'message': str(e)}, 500)
