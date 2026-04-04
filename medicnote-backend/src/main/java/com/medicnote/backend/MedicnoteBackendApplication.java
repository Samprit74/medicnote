package com.medicnote.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class MedicnoteBackendApplication {

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.application.name:MedicNote}")
    private String applicationName;

    public static void main(String[] args) {
        SpringApplication.run(MedicnoteBackendApplication.class, args);
        System.out.println("project is on main method");
    }

    @EventListener(ApplicationReadyEvent.class)
    public void displayStartupInfo() {

        System.out.println();
        System.out.println("==============================================================");

        System.out.println("Application Name : " + applicationName);
        System.out.println("Server Port      : " + serverPort);
        System.out.println("Database URL     : " + databaseUrl);

        System.out.println("API Base URL     : http://localhost:" + serverPort + "/");
        System.out.println("Health Check     : http://localhost:" + serverPort + "/actuator/health");

        System.out.println("Project: MedicNote - Digital Prescription Manager");
        System.out.println("Tech Stack: Spring Boot | MySQL | React | JWT");

        System.out.println("==============================================================");
        System.out.println();
    }
}