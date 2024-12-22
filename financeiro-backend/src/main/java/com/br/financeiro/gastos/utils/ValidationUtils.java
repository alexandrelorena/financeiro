package com.br.financeiro.gastos.utils;

public class ValidationUtils {
    public static boolean isValidInput(String input) {
        return input.matches("^[a-zA-Z0-9_-]+$");
    }
}
