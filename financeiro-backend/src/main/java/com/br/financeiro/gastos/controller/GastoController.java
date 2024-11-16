package com.br.financeiro.gastos.controller;

import com.br.financeiro.gastos.model.Gasto;
import com.br.financeiro.gastos.repository.GastoRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    // Endpoint para buscar despesas por mês
    @Operation(summary = "Buscar despesas por mês")
    @GetMapping("/mes")
    public List<Gasto> getDespesasByMonth(@RequestParam Integer month) {
        return gastoRepository.findByVencimentoMonth(month);
    }

    // Método que já existe para pegar todas as despesas
    @GetMapping
    public List<Gasto> getAllGastos() {
        return gastoRepository.findAll();
    }
    

    // Criação de uma despesa
    @PostMapping
    public Gasto createGasto(@RequestBody Gasto gasto) {
        return gastoRepository.save(gasto);
    }

    // Método para pegar uma despesa por ID
    @GetMapping("/{id}")
    public ResponseEntity<Gasto> getGastoById(@PathVariable Long id) {
        return gastoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

@PutMapping("/{id}")
public ResponseEntity<Gasto> updateGasto(@PathVariable Long id, @RequestBody Gasto gastoAtualizado) {
    return gastoRepository.findById(id)
            .map(gastoExistente -> {
                // Atualiza os campos existentes
                gastoExistente.setNome(gastoAtualizado.getNome());
                gastoExistente.setValor(gastoAtualizado.getValor());
                gastoExistente.setVencimento(gastoAtualizado.getVencimento());
                gastoExistente.setPago(gastoAtualizado.isPago());
                gastoExistente.setStatus(gastoAtualizado.getStatus()); // Atualiza o status
                
                Gasto gastoSalvo = gastoRepository.save(gastoExistente);
                return ResponseEntity.ok(gastoSalvo);
            })
            .orElse(ResponseEntity.notFound().build());
}

    @PutMapping("/{id}/status")
    public ResponseEntity<Gasto> updateStatus(@PathVariable Long id, @RequestBody Gasto gasto) {
        Optional<Gasto> gastoExistente = gastoRepository.findById(id);
        if (gastoExistente.isPresent()) {
            Gasto gastoAtualizado = gastoExistente.get();
            gastoAtualizado.setStatus(gasto.getStatus()); // Isso garante que o status seja atualizado
            gastoAtualizado.setVencimento(gasto.getVencimento()); // Isso atualiza a data de vencimento
            gastoAtualizado.updateStatus(); // Atualiza o status baseado na nova data de vencimento
            Gasto savedGasto = gastoRepository.save(gastoAtualizado);
            return ResponseEntity.ok(savedGasto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<Gasto> pagarDespesa(@PathVariable Long id) {
        Optional<Gasto> optionalGasto = gastoRepository.findById(id);
        if (optionalGasto.isPresent()) {
            Gasto gasto = optionalGasto.get();
            gasto.setPago(true);  // Define o campo pago como true
            gasto.setStatus("Pago");
            gasto = gastoRepository.save(gasto);  // Salva a atualização e atualiza a instância
            System.out.println("Despesa atualizada: " + gasto);  // Log para verificar o valor atualizado de 'pago'
            return ResponseEntity.ok(gasto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }   

    // Método para deletar uma despesa
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
