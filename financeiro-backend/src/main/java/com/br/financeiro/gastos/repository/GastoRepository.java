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
         * Retorna todos os gastos de um determinado mês, ordenados por data de
         * vencimento
         * em ordem crescente. Utiliza uma consulta SQL nativa.
         * 
         * @param month Número do mês (1-12) a ser consultado.
         * @return Lista de gastos do mês especificado.
         */
        @Query(value = "SELECT * FROM gastos g WHERE MONTH(g.vencimento) = :month ORDER BY g.vencimento ASC", nativeQuery = true)
        List<Gasto> findByVencimentoMonthNative(@Param("month") int month);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Retorna todos os gastos com o status especificado, ignorando diferenças entre
         * maiúsculas e minúsculas.
         * 
         * @param status Status dos gastos para a consulta.
         * @return Lista de gastos com o status especificado.
         */
        List<Gasto> findByStatusIgnoreCase(String status);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Retorna todos os gastos associados a uma categoria específica, ignorando
         * diferenças entre maiúsculas e minúsculas.
         * 
         * @param categoria Categoria dos gastos para a consulta.
         * @return Lista de gastos associados à categoria especificada.
         */
        List<Gasto> findByCategoriaIgnoreCase(String categoria);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Retorna todos os gastos de um determinado mês utilizando JPQL.
         * 
         * @param month Número do mês (1-12) a ser consultado.
         * @return Lista de gastos do mês especificado.
         */
        @Query("SELECT g FROM Gasto g WHERE MONTH(g.vencimento) = :month")
        List<Gasto> findByMes(@Param("month") int month);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Remove todos os gastos de um determinado mês utilizando uma consulta SQL
         * nativa.
         * Esta operação é transacional.
         * 
         * @param month Número do mês (1-12) cujos gastos devem ser removidos.
         */
        @Modifying
        @Transactional
        @Query(value = "DELETE FROM gastos g WHERE MONTH(g.vencimento) = :month", nativeQuery = true)
        void deleteByMes(@Param("month") int month);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Atualiza o status de gastos para "vencido" com base nas seguintes condições:
         * - Gastos com status "vencendo" e vencimento anterior à data atual.
         * - Gastos com status "pendente" e vencimento anterior à data atual.
         * Esta operação é transacional.
         * 
         * @param hoje Data de referência para atualização.
         */
        @Transactional
        @Modifying
        @Query("UPDATE Gasto g SET g.status = 'vencido', g.tipo = 3 WHERE " +
                        "(g.status = 'vencendo' AND g.vencimento < :hoje AND g.status != 'pago') OR " +
                        "(g.status = 'pendente' AND g.vencimento < :hoje AND g.status != 'pago')")
        void atualizarStatusVencido(@Param("hoje") LocalDate hoje);
        // @Query("UPDATE Gasto g SET g.status = 'vencido' WHERE " +
        // "(g.status = 'vencendo' AND g.vencimento < :hoje AND g.status != 'pago') OR "
        // +
        // "(g.status = 'pendente' AND g.vencimento < :hoje AND g.status != 'pago')")
        // void atualizarStatusVencido(@Param("hoje") LocalDate hoje);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Atualiza o status de gastos para "vencendo" quando:
         * - O status atual for "pendente".
         * - O vencimento ocorrer na data atual.
         * Esta operação é transacional.
         * 
         * @param hoje Data de referência para atualização.
         */
        @Transactional
        @Modifying
        @Query("UPDATE Gasto g SET g.status = 'vencendo', g.tipo = 2 WHERE " +
                        "(g.status = 'pendente' AND g.vencimento = :hoje AND g.status != 'pago')")
        void atualizarStatusVencendo(@Param("hoje") LocalDate hoje);
        // @Query("UPDATE Gasto g SET g.status = 'vencendo' WHERE " +
        // "(g.status = 'pendente' AND g.vencimento = :hoje AND g.status != 'pago')")
        // void atualizarStatusVencendo(@Param("hoje") LocalDate hoje);

        // ----------------------------------------------------------------------------------------------------------------------

        /**
         * Atualiza o status de gastos para "pendente" quando:
         * - O status atual for "pendente".
         * - O vencimento ocorrer após a data atual.
         * Esta operação é transacional.
         * 
         * @param hoje Data de referência para atualização.
         */
        @Transactional
        @Modifying
        @Query("UPDATE Gasto g SET g.status = 'pendente', g.tipo = 0 WHERE " +
                        "(g.status = 'pendente' AND g.vencimento > :hoje AND g.status != 'pago')")
        void atualizarStatusPendente(@Param("hoje") LocalDate hoje);
        // @Query("UPDATE Gasto g SET g.status = 'pendente' WHERE " +
        // "(g.status = 'pendente' AND g.vencimento > :hoje AND g.status != 'pago')")
        // void atualizarStatusPendente(@Param("hoje") LocalDate hoje);
}
