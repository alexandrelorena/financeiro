package com.br.financeiro.gastos.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.financeiro.gastos.model.Gasto;
import com.br.financeiro.gastos.repository.GastoRepository;

@Service
public class GastoService {

    private final GastoRepository gastoRepository;

    // Injeta o repositório no serviço
    public GastoService(GastoRepository gastoRepository){
        this.gastoRepository = gastoRepository;
    }

    // Método para filtrar gastos por status
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
        atualizarStatusVencendo(); // Atualiza para 'Vencendo'
        atualizarStatusVencido(); // Atualiza para 'Vencido'
    }
    
    public void atualizarStatusGastos() {
        LocalDate hoje = LocalDate.now();

        // Atualizar para "Vencido"
        gastoRepository.atualizarStatusVencido(hoje);

        // Atualizar para "Vencendo"
        gastoRepository.atualizarStatusVencendo(hoje);
    }
}
