package com.medicnote.backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupLogger {

    @Bean
    public ApplicationRunner run() {
        return args -> {
            System.out.println("\n\033[1;96m✔ MEDICNOTE BACKEND STARTED SUCCESSFULLY 🚑\033[0m\n");
        };
    }
}