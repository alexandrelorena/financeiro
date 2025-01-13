package com.br.financeiro.gastos.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.financeiro.gastos.model.Gasto;
import com.br.financeiro.gastos.model.TipoGasto;
import com.br.financeiro.gastos.repository.GastoRepository;

@Service
public class GastoService {

    private final GastoRepository gastoRepository;

    // Injeta o repositório no serviço
    public GastoService(GastoRepository gastoRepository) {
        this.gastoRepository = gastoRepository;
    }

    public List<Gasto> filtrarPorStatus(String status) {
        return gastoRepository.findByStatusIgnoreCase(status);
    }

    @Transactional
    public void atualizarStatusVencendo() {
        LocalDate hoje = LocalDate.now();
        gastoRepository.atualizarStatusVencendo(hoje);
    }

    @Transactional
    public void atualizarStatusVencido() {
        LocalDate hoje = LocalDate.now();
        gastoRepository.atualizarStatusVencido(hoje);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Executa todos os dias à meia-noite
    public void atualizarStatusAutomatico() {
        atualizarStatusVencendo();
        atualizarStatusVencido();
    }

    @Transactional
    public void atualizarStatusDespesas() {
        gastoRepository.callAtualizarStatusDespesas();
    }

    // Método para salvar ou atualizar gastos
    @Transactional
    public Gasto salvarGasto(Gasto gasto) {
        // Validar e garantir a coerência do tipo com base no status
        if (gasto.getTipo() == null) {
            throw new IllegalArgumentException("O tipo do gasto não pode ser nulo.");
        }
        gasto.setTipo(TipoGasto.fromValor(gasto.getTipo().getValor()));

        // Atualizar o status com base na lógica de vencimento
        gasto.updateStatus();

        // Salvar o gasto no banco
        return gastoRepository.save(gasto);
    }
}
