package com.example.matchescrud.repository;

import com.example.matchescrud.model.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    @Query("SELECT m FROM Match m WHERE m.date > CURRENT_DATE")
    List<Match> findUpcomingMatches();

    @Query("SELECT m FROM Match m WHERE m.date <= CURRENT_DATE")
    List<Match> findCompletedMatches();

    @Query("SELECT SUM(m.spectators) FROM Match m")
    Integer sumAllSpectators();

    @Query("SELECT SUM(m.revenue) FROM Match m")
    BigDecimal sumAllRevenue();

    @Query("SELECT FUNCTION('MONTHNAME', m.date) as month, SUM(m.revenue) as revenue " +
            "FROM Match m " +
            "GROUP BY FUNCTION('MONTHNAME', m.date) " +
            "ORDER BY MIN(m.date)")
    List<Object[]> getMonthlyRevenue();

}
