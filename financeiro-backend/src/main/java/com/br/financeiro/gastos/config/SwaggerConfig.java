package com.br.financeiro.gastos.config;

import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API de Controle de Finanças",
        version = "1.0",
        description = "Documentação da API para controle de finanças pessoais."
    )
)
public class SwaggerConfig {
    // Não é necessário adicionar nenhum método aqui
}
