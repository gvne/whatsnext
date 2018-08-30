from exception import InvalidBody



class Song:
    def __init__(self):
        self.id = None
        self.source = None

    @staticmethod
    def from_body(body):
        song = Song()
        for key, value in body.items():
            song.__set_property(key, value)
        return song

    def __set_property(self, key, value):
        if key == "source":
            self.source = value
        elif key == "id":
            self.id = value
        else:
            raise InvalidBody("Invalid key found: " + str(key))

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source
        }

class Playlist:
    def __init__(self):
        self.id = None
        self.owner = None
        self.__songs = []
        self.__current_song = None

    @staticmethod
    def from_body(body):
        playlist = Playlist()
        for key, value in body.items():
            playlist.__set_property(key, value)
        return playlist

    def __set_property(self, key, value):
        if key == "id":
            self.id = value
        elif key == "owner":
            self.owner = value
        elif key == "songs":
            self.songs = value
        elif key == "current_song":
            self.current_song = value
        else:
            raise InvalidBody("Invalid key found: " + str(key))

    def to_dict(self):
        return {
            "id": self.id,
            "owner": self.owner,
            "songs": self.songs,
            "current_song": self.current_song
        }

    @property
    def songs(self):
        output = []
        for song in self.__songs:
            output.append(song.to_dict())
        return output

    @songs.setter
    def songs(self, value):
        self.__songs = []
        for song_dict in value:
            song = Song.from_body(song_dict)
            self.__songs.append(song)

    @property
    def current_song(self):
        if not self.__current_song:
            return self.__current_song
        return self.__current_song.to_dict()

    @current_song.setter
    def current_song(self, value):
        if not value:
            self.__current_song = value
            return
        self.__current_song = Song.from_body(value)

    def append_song(self, song):
        self.__songs.append(song)

    def next(self):
        if not self.__current_song:
            if self.__songs:
                self.__current_song = self.__songs[0]
            return

        song_index = 0
        while song_index < len(self.__songs) - 1:
            if self.__current_song.id == self.__song[song_index].id:
                self.__current_song = self.__song[song_index + 1]
                return
