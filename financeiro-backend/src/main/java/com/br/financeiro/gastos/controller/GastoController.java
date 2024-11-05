package com.br.financeiro.gastos.controller;

import com.br.financeiro.gastos.model.Gasto;
import com.br.financeiro.gastos.repository.GastoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    @GetMapping
    public List<Gasto> getAllGastos() {
        return gastoRepository.findAll();
    }

    @PostMapping
    public Gasto createGasto(@RequestBody Gasto gasto) {
        return gastoRepository.save(gasto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gasto> getGastoById(@PathVariable Long id) {
        return gastoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gasto> updateGasto(@PathVariable Long id, @RequestBody Gasto gastoDetails) {
        return gastoRepository.findById(id)
                .map(gasto -> {
                    gasto.setNome(gastoDetails.getNome());
                    gasto.setValor(gastoDetails.getValor());
                    gasto.setVencimento(gastoDetails.getVencimento());
                    Gasto updatedGasto = gastoRepository.save(gasto);
                    return ResponseEntity.ok(updatedGasto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteGasto(@PathVariable Long id) {
        return gastoRepository.findById(id)
                .map(gasto -> {
                    gastoRepository.delete(gasto);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
