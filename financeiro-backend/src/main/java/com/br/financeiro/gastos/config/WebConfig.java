package com.br.financeiro.gastos.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {
//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/api/**") // Adiciona configuração para todas as rotas que começam com /api
//                 .allowedOrigins("http://localhost:4200") // Permita apenas seu front-end
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
//                 .allowedHeaders("*"); // Permite todos os cabeçalhos
//     }
// }
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200") // Endereço do front-end
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
