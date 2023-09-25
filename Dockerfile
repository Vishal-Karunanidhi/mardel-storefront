FROM registry.access.redhat.com/ubi8/nodejs-16:1-52

USER root

RUN mkdir /opt/app

COPY . /opt/app

WORKDIR /opt/app
RUN npm install

CMD ["npm", "run", "dev"]