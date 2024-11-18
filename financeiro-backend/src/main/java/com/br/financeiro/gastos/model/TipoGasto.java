package com.br.financeiro.gastos.model;

public enum TipoGasto {
    PENDENTE(0),
    PAGO(1),
    VENCIDO(2);

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

