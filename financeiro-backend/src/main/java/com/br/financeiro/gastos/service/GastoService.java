package com.br.financeiro.gastos.service;

import java.util.List;

import org.springframework.stereotype.Service;

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
}
