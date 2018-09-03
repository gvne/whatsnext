FROM node:latest

ENV NPM_CONFIG_LOGLEVEL info
# required
# see this https://github.com/nodejs/docker-node/issues/603
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm install -g @angular/cli
ENV PATH="/home/node/.npm-global/bin:${PATH}"

WORKDIR /home/node/app/whatsnext
CMD ["ng", "serve", "--host", "0.0.0.0", "--watch"]
