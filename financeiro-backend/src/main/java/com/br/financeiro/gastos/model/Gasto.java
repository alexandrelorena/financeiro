package com.br.financeiro.gastos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@Table(name = "gastos")
public class Gasto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O nome não pode ser nulo")
    private String nome;

    @NotNull(message = "O valor não pode ser nulo")
    @Positive(message = "O valor deve ser positivo")
    private double valor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate vencimento;

    @Column(name = "status")
    @JsonInclude(JsonInclude.Include.ALWAYS)
    private String status; // Valor padrão é "Pendente"

    @Column(name = "pago", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    @JsonInclude(JsonInclude.Include.ALWAYS)
    private boolean pago;

    public Gasto() {
        // Definir o status como "Pendente" inicialmente, até que a data de vencimento seja definida
        this.status = "Pendente";
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public LocalDate getVencimento() {
        return vencimento;
    }

    public void setVencimento(LocalDate vencimento) {
        this.vencimento = vencimento;
        updateStatus(); // Atualiza o status sempre que a data de vencimento for alterada
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public boolean isPago() {
        return pago;
    }

    public void setPago(boolean pago) {
        this.pago = pago;
    }

    /**
     * Atualiza o status com base na data de vencimento.
     * O status será "Vencido" se a data já passou, ou "Pendente" caso contrário.
     */
    public void updateStatus() {
        if (vencimento != null) {
            LocalDate hoje = LocalDate.now();
            if (vencimento.isBefore(hoje)) {
                this.status = "Vencido";
            } else if (vencimento.isEqual(hoje)) {
                this.status = "Vence Hoje";
            } else {
                this.status = "Pendente";
            }
        }
    }
}
