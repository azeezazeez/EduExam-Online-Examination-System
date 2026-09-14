# ---------- Stage 1: Build with Maven ----------
FROM maven:3.8-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (caching layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Stage 2: Runtime with JRE ----------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built JAR file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (change to your app's port, likely 8080 for Spring Boot)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
