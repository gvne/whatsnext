import uuid
from pywhatsnext.exception import InvalidBody, NotFoundException
from pywhatsnext import settings

from pywhatsnext.utils import raise_for_response, get_status_code, get_source_url


class Model:
    def __init__(self):
        # Auto set the id
        self.id = str(uuid.uuid1())

    def init_from_body(self, body):
        for key, value in body.items():
            self.__set_property(key, value)

    def __set_property(self, key, value):
        if not hasattr(self, key):
            raise InvalidBody("Invalid key found: " + str(key))
        setattr(self, key, value)

    def to_dict(self):
        result = {}
        for attribute in vars(self):
            result[attribute] = getattr(self, attribute)
        return result


class Song(Model):
    def __init__(self):
        super(Song, self).__init__()
        self.source = None

    @staticmethod
    def from_body(body):
        song = Song()
        song.init_from_body(body)
        return song


class Playlist(Model):
    def __init__(self):
        super(Playlist, self).__init__()
        self.owner = None
        self.songs = []
        self.current_song = None

    @staticmethod
    def from_id(id):
        """
        Read a playlist from the database
        Raise a NotFoundException if object does not exists
        """
        response = settings.database.get_item(Key={'id': id})
        raise_for_response(response)
        if not "Item" in response.keys():
            raise NotFoundException("Playlist with id " + str(id) + " couldn't be found")
        playlist = Playlist()
        playlist.init_from_body(response["Item"])
        return playlist

    def save(self):
        """
        write to the database
        """
        response = settings.database.put_item(Item=self.to_dict())
        raise_for_response(response)

    def delete(self):
        """
        removes the playlist from the database
        """
        response = settings.database.delete_item(Key={'id': str(self.id)})
        raise_for_response(response)

    def append(self, song):
        self.songs.append(song.to_dict())

    @property
    def __current_song(self):
        if not self.current_song:
            return None
        return Song.from_body(self.current_song)

    def __song_at_index(self, song_index):
        if len(self.songs) < song_index:
            return
        return Song.from_body(self.songs[song_index])

    def next(self):
        if not self.current_song:
            if self.songs:
                self.current_song = self.songs[0]
            return

        song_index = 0
        while song_index < len(self.songs) - 1:
            if self.__current_song.id == self.__song_at_index(song_index).id:
                self.current_song = self.songs[song_index + 1]
                return
