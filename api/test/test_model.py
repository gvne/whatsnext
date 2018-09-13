import unittest
import pywhatsnext


class TestModel(unittest.TestCase):
    def test_song(self):
        song_id = 12
        song_source = "https://www.youtube.com/watch?v=wTqEB0MyGdY"
        original_body = {
            "id": 12,
            "source": song_source
        }
        song = pywhatsnext.Song()
        song.init_from_body(original_body)
        self.assertNotEqual(song.id, None)
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

    def test_read_write_playlist(self):
        # fail to read
        with self.assertRaises(pywhatsnext.NotFoundException):
            pywhatsnext.Playlist.from_id("anidthatdoesntexist")

        playlist = pywhatsnext.Playlist()

        # Successful read and write
        playlist.save()

        another_playlist = pywhatsnext.Playlist.from_id(playlist.id)
        self.assertEqual(playlist.to_dict(), another_playlist.to_dict())

        # update the song needs to get a save to be sent to database
        song_body = { "source": "a song source" }
        playlist.append(pywhatsnext.Song.from_body(song_body))
        self.assertNotEqual(
            playlist.to_dict(),
            pywhatsnext.Playlist.from_id(playlist.id).to_dict()
        )
        playlist.save()
        self.assertEqual(
            playlist.to_dict(),
            pywhatsnext.Playlist.from_id(playlist.id).to_dict()
        )

        # test delete
        playlist.delete()
        with self.assertRaises(pywhatsnext.NotFoundException):
            pywhatsnext.Playlist.from_id(playlist.id)

    def test_multiple_add_next(self):
        playlist = pywhatsnext.Playlist()
        playlist.save()

        for i in range(10):
            song = pywhatsnext.Song.from_body(
                {"source": "source" + str(i), "id": "id" + str(i)}
            )
            playlist.append(song);
            playlist.save()

            playlist.next()
            playlist.save()
