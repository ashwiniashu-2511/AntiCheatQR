FROM tomcat:10.1-jdk21-temurin

RUN rm -rf /usr/local/tomcat/webapps/*

COPY build/classes /usr/local/tomcat/webapps/AntiCheatQR/WEB-INF/classes

COPY src/main/webapp /usr/local/tomcat/webapps/AntiCheatQR

EXPOSE 8080

CMD ["catalina.sh", "run"]