import boto3
import os

## Database
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
# Unit test database on aws. Should be created on your tennant
database = dynamodb.Table("whatsnext-unit-test")
if "DATABASE_TABLE" in os.environ.keys():
    database = dynamodb.Table(os.environ["DATABASE_TABLE"])

## Interface
default_page_size = 25
