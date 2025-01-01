
package com.br.financeiro.gastos.controller;

import com.br.financeiro.gastos.utils.ValidationUtils;
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

    @Autowired
    private GastoRepository gastoRepository;

    /**
     * Retorna uma lista de gastos com base no status informado.
     * .
     */
    @GetMapping("/status/{status}")
    public List<Gasto> getGastosPorStatus(@PathVariable String status) {
        return gastoService.filtrarPorStatus(status);
    }

    /**
     * Retorna uma lista de despesas filtradas pelo mês informado.
     * 
     */
    @Operation(summary = "Buscar despesas por mês")
    @GetMapping("/mes")
    public List<Gasto> getDespesasByMonth(@RequestParam Integer month) {
        return gastoRepository.findByVencimentoMonthNative(month);
    }

    /**
     * Retorna uma lista de todas as despesas.
     * 
     */
    @GetMapping
    public List<Gasto> getAllGastos() {
        return gastoRepository.findAll();
    }

    /**
     * Cria um novo gasto e atualiza seu status automaticamente.
     * 
     */
    @PostMapping
    public ResponseEntity<Gasto> createGasto(@RequestBody Gasto gasto) {
        try {
            Gasto novoGasto = gastoService.salvarGasto(gasto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoGasto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Busca um gasto pelo seu ID.
     * 
     */
    @GetMapping("/{id}")
    public ResponseEntity<Gasto> getGastoById(@PathVariable Long id) {
        return gastoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualiza os dados de um gasto específico pelo ID.
     * 
     */
    @PutMapping("/{id}")
    public ResponseEntity<Gasto> updateGasto(@PathVariable Long id, @RequestBody Gasto gastoAtualizado) {
        return gastoRepository.findById(id)
                .map(gastoExistente -> {
                    gastoExistente.setNome(gastoAtualizado.getNome());
                    gastoExistente.setCategoria(gastoAtualizado.getCategoria());
                    gastoExistente.setValor(gastoAtualizado.getValor());
                    gastoExistente.setVencimento(gastoAtualizado.getVencimento());
                    gastoExistente.setTipo(gastoAtualizado.getTipo());
                    gastoExistente.updateStatus();

                    Gasto gastoSalvo = gastoRepository.save(gastoExistente);
                    return ResponseEntity.ok(gastoSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualiza o status de um gasto pelo seu ID.
     * 
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String novoTipo) {
        return gastoRepository.findById(id)
                .map(gastoExistente -> {
                    try {
                        TipoGasto tipo = TipoGasto.valueOf(novoTipo.toUpperCase());
                        gastoExistente.setTipo(tipo);
                        gastoExistente.updateStatus();

                        Gasto gastoSalvo = gastoRepository.save(gastoExistente);
                        return ResponseEntity.ok(gastoSalvo);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body("Tipo de gasto inválido: " + novoTipo);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Marca um gasto como pago pelo seu ID.
     * 
     */
    @PutMapping("/{id}/pagar")
    public ResponseEntity<Gasto> pagarDespesa(@PathVariable Long id) {
        Optional<Gasto> optionalGasto = gastoRepository.findById(id);
        if (optionalGasto.isPresent()) {
            Gasto gasto = optionalGasto.get();
            gasto.setTipo(TipoGasto.pago);
            gasto.setStatus("pago");
            gasto = gastoRepository.save(gasto);
            return ResponseEntity.ok(gasto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Exclui um gasto pelo seu ID.
     * 
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteGasto(@PathVariable Long id) {
        return gastoRepository.findById(id)
                .map(gasto -> {
                    gastoRepository.delete(gasto);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Exclui todas as despesas de um determinado mês.
     * 
     */
    @DeleteMapping("/mes/{mes}")
    public ResponseEntity<?> apagarDespesasDoMes(@PathVariable Integer mes) {
        try {
            gastoRepository.deleteByMes(mes);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar despesas: " + e.getMessage());
        }
    }

    /**
     * Atualiza o status de despesas para "vencendo" para as que vencem hoje.
     * 
     */
    @PutMapping("/status/vencendo")
    public ResponseEntity<String> atualizarStatusVencendo() {
        try {
            gastoService.atualizarStatusVencendo();
            return ResponseEntity.ok("Status atualizado para 'vencendo' para despesas vencendo hoje.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar status: " + e.getMessage());
        }
    }

    /**
     * Atualiza o status de despesas para "vencido" para as que já venceram.
     * 
     */
    @PutMapping("/status/vencido")
    public ResponseEntity<String> atualizarStatusVencido() {
        try {
            gastoService.atualizarStatusVencido();
            return ResponseEntity.ok("Status atualizado para 'vencido' para despesas vencidas.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar status: " + e.getMessage());
        }
    }

    /**
     * Valida a entrada de dados para buscar detalhes.
     * 
     */
    @GetMapping("/detalhes/{input}")
    public ResponseEntity<String> getDetails(@PathVariable("input") String input) {
        if (!ValidationUtils.isValidInput(input)) {
            return ResponseEntity.badRequest().body("Entrada inválida. Permitidos apenas letras, números, '_' e '-'.");
        }
        return ResponseEntity.ok("Parâmetro válido!");
    }
}
