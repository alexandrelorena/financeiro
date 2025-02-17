package com.br.financeiro.gastos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class GastosApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		// Define as variáveis do .env como variáveis do sistema
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		SpringApplication.run(GastosApplication.class, args);

		System.out.println("Banco de dados: " + System.getProperty("DB_URL"));
		System.out.println("Usuário: " + System.getProperty("DB_USERNAME"));
	}
}
