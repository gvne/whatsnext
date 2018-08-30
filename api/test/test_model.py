import unittest
import pywhatsnext


class TestModel(unittest.TestCase):
    def test_song(self):
        song_id = 12
        song_source = "https://www.youtube.com/watch?v=wTqEB0MyGdY"
        original_body = {
            "id": song_id,
            "source": song_source
        }
        song = pywhatsnext.Song()
        song.init_from_body(original_body)
        self.assertEqual(song.id, song_id)
        self.assertEqual(song.source, song_source)
        self.assertEqual(song.to_dict(), original_body)

    def test_invalid_song_raises(self):
        song = pywhatsnext.Song()
        with self.assertRaises(pywhatsnext.InvalidBody):
            song.init_from_body(
                {
                    "id": 12,
                    "source": "https://www.youtube.com/watch?v=wTqEB0MyGdY",
                    "invalid_field": "somevalue"
                }
            )

    def test_playlist(self):
        original_body = {
            "id": "123",
            "owner": "someuser",
            "current_song": "asongid",
            "songs": [
                {"id": "asongid", "source": "asongsource"}
            ]
        }
        playlist = pywhatsnext.Playlist()
        playlist.init_from_body(original_body)
        self.assertEqual(playlist.to_dict(), original_body)

    def test_playlist_actions(self):
        original_body = {
            "id": "123",
            "owner": "someuser",
            "songs": [
                {"id": "asongid", "source": "asongsource"}
            ]
        }
        playlist = pywhatsnext.Playlist()
        playlist.init_from_body(original_body)
        self.assertEqual(playlist.current_song, None)
        playlist.next()
        self.assertEqual(playlist.current_song['id'], "asongid")
        playlist.next()
        self.assertEqual(playlist.current_song['id'], "asongid")
        playlist.append(
            pywhatsnext.Song.from_body(
                {"id": "anothersongid", "source": "nothing"}
            )
        )
        self.assertEqual(playlist.current_song['id'], "asongid")
        playlist.next()
        self.assertEqual(playlist.current_song['id'], "anothersongid")
