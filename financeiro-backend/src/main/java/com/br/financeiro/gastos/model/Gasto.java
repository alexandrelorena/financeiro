/**
 * Representa uma despesa no sistema financeiro.
 * Inclui informações sobre nome, categoria, valor, vencimento, tipo e status.
 * Atualiza automaticamente o status com base no tipo e na data de vencimento.
 */
package com.br.financeiro.gastos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

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

    @NotNull(message = "A categoria não pode ser nula")
    private String categoria;

    @NotNull(message = "O valor não pode ser nulo")
    @PositiveOrZero(message = "O valor deve ser positivo")
    private double valor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private LocalDate vencimento;

    @Column(name = "status")
    @JsonInclude(JsonInclude.Include.ALWAYS)
    private String status;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    private TipoGasto tipo;

    public Gasto() {
        this.tipo = TipoGasto.pendente;
        updateStatus();
    }

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

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
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
        updateStatus();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public TipoGasto getTipo() {
        return tipo;
    }

    public void setTipo(TipoGasto tipo) {
        this.tipo = tipo;
        updateStatus();
    }

    // Atualiza o status com base no tipo e na data de vencimento
    public void updateStatus() {
        if (this.tipo == TipoGasto.pago) {
            this.status = "pago";
        } else if (vencimento != null) {
            LocalDate hoje = LocalDate.now();
            if (vencimento.isBefore(hoje)) {
                this.status = "vencido";
            } else if (vencimento.equals(hoje)) {
                this.status = "vencendo";
            } else {
                this.status = "pendente";
            }
        } else {
            this.status = "Status Indefinido";
        }
    }

    // Método chamado antes de persistir no banco (para inserção)
    @PrePersist
    public void beforeInsert() {
        updateStatus();
    }

    // Método chamado antes de atualizar no banco
    @PreUpdate
    public void beforeUpdate() {
        updateStatus();
    }
}
