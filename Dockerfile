FROM tomcat:10.1-jdk25-temurin

RUN rm -rf /usr/local/tomcat/webapps/*

COPY build/classes /usr/local/tomcat/webapps/ROOT/WEB-INF/classes

COPY src/main/webapp /usr/local/tomcat/webapps/ROOT

EXPOSE 8080

CMD ["catalina.sh", "run"]
