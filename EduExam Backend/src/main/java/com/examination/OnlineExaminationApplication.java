package com.examination;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
public class OnlineExaminationApplication {
	public static void main(String[] args) {
		// Load .env file
		try {
			Files.lines(Paths.get(".env"))
					.filter(line -> !line.startsWith("#") && line.contains("="))
					.forEach(line -> {
						String[] parts = line.split("=", 2);
						System.setProperty(parts[0].trim(), parts[1].trim());
					});
			System.out.println("✅ Environment variables loaded");
		} catch (IOException e) {
			System.out.println("⚠️  No .env file found, using defaults");
		}

		SpringApplication.run(OnlineExaminationApplication.class, args);
		System.out.println("🚀 Online Examination Backend Started!");
	}
}