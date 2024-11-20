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
    private String status;

    // @Column(name = "tipo", nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    // @JsonInclude(JsonInclude.Include.ALWAYS)
    // private int tipo;
    @NotNull
    @Enumerated(EnumType.ORDINAL) // Usa os índices do enum
    private TipoGasto tipo;
   

    public Gasto() {
        this.tipo = TipoGasto.PENDENTE; // Inicialmente como Pendente
        updateStatusFromTipo();
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

    public TipoGasto getTipo() {
      return tipo;
    }

    public void setTipo(TipoGasto tipo) {
        this.tipo = tipo;
        updateStatusFromTipo(); // Atualiza o status com base no tipo
    }

    public void updateStatusFromTipo() {
        switch (this.tipo) {
            case PENDENTE:
                updateStatus(); // Calcula baseado na data se for Pendente
                break;
            case PAGO:
                this.status = "Pago";
                break;
            case VENCIDO:
                this.status = "Vencido";
                break;
        }
    }

    public void updateStatus() {
      if (this.tipo == TipoGasto.PENDENTE && vencimento != null) {
          LocalDate hoje = LocalDate.now();
  
          if (vencimento.isBefore(hoje)) {
              this.status = "Vencido";
          } else if (vencimento.equals(hoje)) {
              this.status = "Vence Hoje";
          } else {
              this.status = "Pendente";
          }
      } else if (this.tipo == TipoGasto.PAGO) {
          this.status = "Pago";
      } else if (this.tipo == TipoGasto.VENCIDO) {
          this.status = "Vencido";
      }
  } 
}

