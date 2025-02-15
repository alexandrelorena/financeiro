package com.br.financeiro.gastos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ContentController {

    @RequestMapping("/content")
    public String content() {
        // Caminho relativo ao diretório 'src/main/resources/static'
        return "forward:/index.html";
    }
}
