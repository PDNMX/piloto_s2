FROM node:12

ADD . /piloto_s2
WORKDIR /piloto_s2


RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean


EXPOSE 8080

CMD ["yarn", "start"]
