package org.example.config;

import org.example.entity.Student;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfiguration {

    @Bean
    public Student student() {
        return new Student();
    }
}
