class QueryException(Exception):
    """
    Exception raise when a query to the database fails
    """
    def __init__(self, status_code, response):
        self.status_code = status_code
        self.response = response


class InvalidBody(Exception):
    def __init__(self, message):
        self.message = message
