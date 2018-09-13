import argparse
import requests


parser = argparse.ArgumentParser(description='Run whatsnext integration tests')
parser.add_argument('origin', metavar='origin', type=str, help='The API url')
args = parser.parse_args()

# Create a playlist
response = requests.post(args.origin + "/v1/playlist")
response.raise_for_status()
playlist_id = response.json()['id']

# We shouldn't be able to add a song with an id. The id is automatically created
response = requests.post(
    args.origin + "/v1/playlist/" + playlist_id + "/append",
    json={"youtube_id": "somesongsource", "id": "someid"}
)
assert response.status_code != 200

# add a song
response = requests.post(
    args.origin + "/v1/playlist/" + playlist_id + "/append",
    json={"youtube_id": "somesongsource"}
)
response.raise_for_status()

# move to next song
response = requests.post(args.origin + "/v1/playlist/" + playlist_id + "/next")
response.raise_for_status()
playlist = response.json()

# get the song from id and make sure it didn't change
response = requests.get(args.origin + "/v1/playlist/" + playlist_id)
response.raise_for_status()
should_be_same_playlist = response.json()

assert should_be_same_playlist == playlist

# remove the playlist
response = requests.delete(args.origin + "/v1/playlist/" + playlist_id)
response.raise_for_status()
