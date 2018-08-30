# Brief

What's Next is a web application allowing people to create collaborative
playlists broadcasted on a unique device.  
This is especially useful in events when only one device is playing. Instead of
forcing people to get to that device (most frequently forcing it to be unlocked)
and queue their song, do it online !

# Architecture

The system is broken down into a application and an API

## API

To lower the cost of the API hosting, we rely developped a serverless API on
AWS.  
It can be easily deployed using AWS SAM:

```bash
aws cloudformation package --template ./api/sam.yaml --s3-bucket NameOfABucket --output-template /tmp/post-saml.yaml --region us-east-1
aws cloudformation deploy --template-file /tmp/post-saml.yaml --stack-name whatsnext --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

## Application

Coming soon...
