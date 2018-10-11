#!/bin/bash
# configure - A script to configure the whatsnext application.

usage() {
  echo "usage: configure.sh --yt-key --auth | [-h]"
}

# parse parameters
youtube_data_api_key=""
auth_client_id=""
auth_client_secret=""
while [ "$1" != "" ]; do
    case $1 in
        -y | --yt-key )
          shift
          youtube_data_api_key=$1
          ;;
        --auth )
          shift
          auth_client_id=$1
          ;;
        --auth-secret )
          shift
          auth_client_secret=$1
          ;;
        -h | --help )
          usage
          exit
          ;;
        * )
          usage
          exit 1
    esac
    shift
done

if [ -z "$youtube_data_api_key" ] || [ -z "$auth_client_id" ] || [ -z "$auth_client_secret" ]; then
  usage
  exit 1
fi

# Fill up the keys.ts file with the API keys
current_dir="$(dirname $0)"
key_file_path=$current_dir/src/app/keys.ts

echo "export const YOUTUBE_API_KEY = \"$youtube_data_api_key\";" > $key_file_path
echo "export const AUTH_CLIENT_ID = \"$auth_client_id\";" >> $key_file_path
echo "export const AUTH_CLIENT_SECRET = \"$auth_client_secret\";" >> $key_file_path
