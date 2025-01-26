# Social Management Service

## Local Run

### Database
Run the PostgreSQL database using Docker:
```bash
docker run --name social-management-postgres \
  -e POSTGRES_DB=social_management_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  -d postgres:15
```

### Gradle Build
To build and run the Spring Boot web application locally:
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

- Another option is to set --spring.profiles.active=local in running configuration and then run the app.

---

## Run in Docker

Before running the application in Docker, make sure the `.war` file is generated during the pipeline and placed in the `build/libs/` directory with the name format:  
`social-management-*.war`

### Build the Docker Image
Build the Docker image:
```bash
docker build -t social-management --no-cache .
```

### Start Services
Run the application and database using Docker Compose:
```bash
docker-compose up --force-recreate
```

---

## Swagger API Documentation

Once the application is running, you can access the API documentation:

- JSON API Docs: [http://localhost:8080/social-management/v3/api-docs](http://localhost:8080/social-management/v3/api-docs)
- YAML API Docs: [http://localhost:8080/social-management/v3/api-docs.yaml](http://localhost:8080/social-management/v3/api-docs.yaml)
- Swagger UI: [http://localhost:8080/social-management/swagger-ui/index.html](http://localhost:8080/social-management/swagger-ui/index.html)

---

Feel free to let me know if you need any updates or additional details for the README!