package com.br.financeiro.gastos.repository;

import com.br.financeiro.gastos.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    // @Query("SELECT g.id, g.nome, g.valor, g.vencimento, g.status, g.pago FROM Gasto g WHERE MONTH(g.vencimento) = :month")
    // List<Gasto> findByVencimentoMonth(@Param("month") Integer month);
    
    @Query(value = "SELECT * FROM gastos g WHERE MONTH(g.vencimento) = :month ORDER BY g.vencimento ASC", nativeQuery = true)
    List<Gasto> findByVencimentoMonthNative(@Param("month") int month);

    List<Gasto> findByStatusIgnoreCase(String status);

    @Query("SELECT g FROM Gasto g WHERE MONTH(g.vencimento) = :month")
    List<Gasto> findByMes(@Param("month") int month);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM gastos g WHERE MONTH(g.vencimento) = :month", nativeQuery = true)
    void deleteByMes(@Param("month") int month);

}
