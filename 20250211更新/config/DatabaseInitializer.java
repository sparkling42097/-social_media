package com.scott.chat.config;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseInitializer implements FlywayMigrationStrategy {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Override
    public void migrate(Flyway flyway) {
        String baseUrl = url.substring(0, url.indexOf("/social"));
        try (Connection conn = DriverManager.getConnection(baseUrl, username, password)) {
            Statement stmt = conn.createStatement();
            stmt.execute("DROP DATABASE IF EXISTS social");
            stmt.execute("CREATE DATABASE social");
            
            // 執行 Flyway 遷移
            flyway.migrate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}