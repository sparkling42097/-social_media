//package com.scott.chat.config;
//
//import org.flywaydb.core.Flyway;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class FlywayConfig {
//
//	@Bean(initMethod = "clean")
//	public Flyway flyway() {
//		return Flyway.configure()
//				.dataSource("jdbc:mysql://localhost/social", "root", "")
//				.load();
//	}
//}