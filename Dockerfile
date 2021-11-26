#1 stage
# select node version
FROM node:14.16
RUN mkdir  /usr/src/app
WORKDIR /usr/src/app
#COPY include package & package.json
COPY package.json /usr/src/app/package.json
#copy source to dest

RUN npm install
RUN npm install react-scripts@4.0.3

COPY . .

RUN npm run build 

#2 staged
FROM nginx:1.14.2-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

EXPOSE 3004
CMD ["nginx","-g", "daemon off;"]
