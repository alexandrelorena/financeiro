package com.br.financeiro.gastos.controller;

import com.br.financeiro.gastos.model.Gasto;
import com.br.financeiro.gastos.service.GastoService;
import com.br.financeiro.gastos.model.TipoGasto;
import com.br.financeiro.gastos.repository.GastoRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    private final GastoService gastoService;

    @Autowired
    public GastoController(GastoService gastoService) {
        this.gastoService = gastoService;
    }

    @GetMapping("/status/{status}")
    public List<Gasto> getGastosPorStatus(@PathVariable String status) {
        return gastoService.filtrarPorStatus(status);
    }

    @Autowired
    private GastoRepository gastoRepository;

    @Operation(summary = "Buscar despesas por mês")
    @GetMapping("/mes")
    public List<Gasto> getDespesasByMonth(@RequestParam Integer month) {
        return gastoRepository.findByVencimentoMonthNative(month);
    }

    @GetMapping
    public List<Gasto> getAllGastos() {
        return gastoRepository.findAll();
    }

    @PostMapping
    public Gasto createGasto(@RequestBody Gasto gasto) {
        gasto.updateStatus();
        // gasto.setStatus(gasto.getStatus());
        return gastoRepository.save(gasto);
    }

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
                    gastoExistente.setNome(gastoAtualizado.getNome());
                    gastoExistente.setValor(gastoAtualizado.getValor());
                    gastoExistente.setVencimento(gastoAtualizado.getVencimento());
                    gastoExistente.setTipo(gastoAtualizado.getTipo());
                    gastoExistente.updateStatus();

                    Gasto gastoSalvo = gastoRepository.save(gastoExistente);
                    return ResponseEntity.ok(gastoSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<? extends Object> updateStatus(@PathVariable Long id, @RequestBody String novoTipo) {
        return gastoRepository.findById(id)
                .map(gastoExistente -> {
                    try {
                        TipoGasto tipo = TipoGasto.valueOf(novoTipo.toUpperCase());
                        gastoExistente.setTipo(tipo);
                        gastoExistente.updateStatus();

                        Gasto gastoSalvo = gastoRepository.save(gastoExistente);
                        return ResponseEntity.ok(gastoSalvo);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(null);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<Gasto> pagarDespesa(@PathVariable Long id) {
        Optional<Gasto> optionalGasto = gastoRepository.findById(id);
        if (optionalGasto.isPresent()) {
            Gasto gasto = optionalGasto.get();
            gasto.setTipo(TipoGasto.PAGO);
            gasto.setStatus("Pago");
            gasto = gastoRepository.save(gasto);
            return ResponseEntity.ok(gasto);
        } else {
            return ResponseEntity.notFound().build();
        }
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

    @DeleteMapping("/mes/{mes}")
    public ResponseEntity<?> apagarDespesasDoMes(@PathVariable Integer mes) {
        try {
            gastoRepository.deleteByMes(mes); 
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar despesas: " + e.getMessage());
        }
    }


}
