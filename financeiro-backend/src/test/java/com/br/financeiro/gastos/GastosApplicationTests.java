package com.br.financeiro.gastos;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext
public class GastosApplicationTests {

    @BeforeAll
    static void setupEnvironment() {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

        System.out.println("Banco de dados: " + System.getProperty("DB_URL"));
        System.out.println("Usuário: " + System.getProperty("DB_USERNAME"));
    }

    @Test
    void contextLoads() {
        // O contexto do Spring será carregado automaticamente pelo @SpringBootTest
    }
}
