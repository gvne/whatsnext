from pywhatsnext.exception import InvalidBody


class Model:
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
        self.id = None
        self.source = None

    @staticmethod
    def from_body(body):
        song = Song()
        song.init_from_body(body)
        return song


class Playlist(Model):
    def __init__(self):
        self.id = None
        self.owner = None
        self.songs = []
        self.current_song = None

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
