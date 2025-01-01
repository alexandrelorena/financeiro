package com.br.financeiro.gastos.model;

public enum TipoGasto {
    pendente(0),
    pago(1),
    vencendo(2),
    vencido(3);

    private final int valor;

    TipoGasto(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }

    public static TipoGasto fromValor(int valor) {
        for (TipoGasto tipo : TipoGasto.values()) {
            if (tipo.getValor() == valor) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo inválido: " + valor);
    }
}
