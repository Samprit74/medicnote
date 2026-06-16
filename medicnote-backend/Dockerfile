# ==========================================
# 1. Build Stage
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .

RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests


# ==========================================
# 2. Run Stage
# ==========================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the generated jar
COPY --from=build /app/target/*.jar app.jar

# Render injects PORT automatically
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]