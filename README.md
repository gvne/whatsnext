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

### Unit tests

To run the unit test, you need to create a test table on AWS Dynamodb named `whatsnext-unit-test` with a primary key named `id` of type `string`  

Then, run them using:
```bash
cd api
python -m unittest discover
```

## Application

The application is based on Angular.  

First, configure the application using the right API keys:
```bash
bash whatsnext/configure.sh --yt-key [Your YOUTUBE DATA API KEY]
```

To ease the development, we give access to a docker container. To build it:
```bash
docker build -t whatsnext-app -f Dockerfile.app .
```

To get an interactive prompt (to run the `npm install` command for example):
```bash
docker run -it --rm -v$(pwd):/home/node/app whatsnext-app npm install
```

To start a development server on port 4200
```bash
docker run -v$(pwd):/home/node/app -p4200:4200 whatsnext-app
```

To build
```bash
docker run -it --rm -v$(pwd):/home/node/app ng build
```
