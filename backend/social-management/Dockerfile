FROM openjdk:17-oracle

ARG WAR_FILE=build/libs/social-management-*.war
 
COPY --chown=101:101 ${WAR_FILE} social-management.war
USER 101
EXPOSE 8080

CMD ["java","-jar","/social-management.war"]
