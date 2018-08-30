import logging
from exception import QueryException


def get_status_code(query_response):
    """
    Get a status code from a boto3 response
    """
    try:
        return query_response['ResponseMetadata']['HTTPStatusCode']
    except:
        logging.debug("Couldn't get status code from response " + str(query_response))
        return 505

def raise_for_response(response):
    """
    Raise an QueryException if the query response shows that it failed
    """
    status_code = get_status_code(response)
    if status_code == 200:
        return
    raise QueryException(status_code, response)

def get_source_url(event):
    """
    Rebuilds the source url from the lambda event
    """
    host = event['headers']['Host']
    scheme = event['headers']['X-Forwarded-Proto']
    path = event['path']
    return scheme + "://" + host + path
