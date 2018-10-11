#!/bin/bash
# configure - A script to configure the whatsnext application.

usage() {
  echo "usage: configure.sh [-y | --yt-key] | [-h]]"
}

# parse parameters
youtube_data_api_key=""
while [ "$1" != "" ]; do
    case $1 in
        -y | --yt-key )
          shift
          youtube_data_api_key=$1
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

# Fill up the keys.ts file with the API keys
current_dir="$(dirname $0)"
key_file_path=$current_dir/src/app/keys.ts

echo "export const YOUTUBE_API_KEY = \"$youtube_data_api_key\";" > $key_file_path
