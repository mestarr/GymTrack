FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css logo.svg favicon.svg fetchData.js displayData.js pageHandling.js formHandling.js filterHandling.js chartHandling.js /usr/share/nginx/html/

EXPOSE 80
