package com.br.financeiro.gastos.repository;

import com.br.financeiro.gastos.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    /**
     * Consulta todos os gastos do mês especificado, ordenados por data de vencimento de forma ascendente.
     * Utiliza uma query SQL nativa.
     * @param month Mês desejado para a consulta (1-12).
     * @return Lista de gastos do mês especificado.
     */
    
    @Query(value = "SELECT * FROM gastos g WHERE MONTH(g.vencimento) = :month ORDER BY g.vencimento ASC", nativeQuery = true)
    List<Gasto> findByVencimentoMonthNative(@Param("month") int month);

    // ----------------------------------------------------------------------------------------------------------------------

        /**
     * Busca todos os gastos com o status especificado, ignorando diferenças de maiúsculas e minúsculas.
     * @param status Status dos gastos para a consulta.
     * @return Lista de gastos com o status especificado.
     */

    List<Gasto> findByStatusIgnoreCase(String status);

    // ----------------------------------------------------------------------------------------------------------------------

        /**
     * Busca todos os gastos pertencentes a uma categoria específica, ignorando diferenças de maiúsculas e minúsculas.
     * @param categoria Categoria desejada para a consulta.
     * @return Lista de gastos da categoria especificada.
     */

    List<Gasto> findByCategoriaIgnoreCase(String categoria);

    // ----------------------------------------------------------------------------------------------------------------------

        /**
     * Consulta todos os gastos do mês especificado utilizando JPQL.
     * @param month Mês desejado para a consulta (1-12).
     * @return Lista de gastos do mês especificado.
     */

    @Query("SELECT g FROM Gasto g WHERE MONTH(g.vencimento) = :month")
    List<Gasto> findByMes(@Param("month") int month);

    // ----------------------------------------------------------------------------------------------------------------------

        /**
     * Deleta todos os gastos do mês especificado utilizando uma query SQL nativa.
     * Esta operação é transacional.
     * @param month Mês dos gastos a serem deletados (1-12).
     */

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM gastos g WHERE MONTH(g.vencimento) = :month", nativeQuery = true)
    void deleteByMes(@Param("month") int month);

    // ----------------------------------------------------------------------------------------------------------------------

    /**
     * Atualiza o status dos gastos para "Vencendo" quando a data de vencimento for igual à data especificada
     * e o status atual for "pendente". Esta operação é transacional.
     * @param data Data de vencimento a ser considerada.
     */

    @Transactional
    @Modifying
    @Query("UPDATE Gasto g SET g.status = 'Vencendo' WHERE g.vencimento = :data AND g.status = 'pendente'")
    void atualizarStatusVencendo(@Param("data") LocalDate data);

    // ----------------------------------------------------------------------------------------------------------------------

    /**
     * Atualiza o status dos gastos para "Vencido" com base nas seguintes condições:
     * - Gastos com vencimento anterior à data especificada e status "pendente".
     * - Gastos com status "vencendo" cujo vencimento não coincide com a data especificada.
     * Esta operação é transacional.
     * @param data Data de referência para a atualização.
     */

    @Transactional
    @Modifying
    @Query("UPDATE Gasto g SET g.status = 'Vencido' WHERE (g.vencimento < :data AND g.status = 'pendente') OR (g.status = 'vencendo' AND g.vencimento != :data)")
    void atualizarStatusVencido(@Param("data") LocalDate data);  
}
