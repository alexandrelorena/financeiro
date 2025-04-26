package com.br.financeiro.gastos;

/*

 * Copyright (c) 2025 Alexandre Lorena
 * Licensed under the MIT License. See LICENSE file for details.
 */

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GastoApplication {

    public static void main(String[] args) {
        // Carregar as variáveis do arquivo .env
        Dotenv dotenv = Dotenv.load();

        // Configurar as variáveis no sistema automaticamente
        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

        SpringApplication.run(GastoApplication.class, args);
    }
}
