package com.example.matchescrud.controller;

import com.example.matchescrud.dto.response.MatchStatsResponse;
import com.example.matchescrud.service.MatchServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin("http://localhost:4200")
public class AdminStatsController {

    private final MatchServiceImp matchService;

    public AdminStatsController(MatchServiceImp matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/stats/matches")
    public ResponseEntity<MatchStatsResponse> getMatchesStats() {
        return ResponseEntity.ok(matchService.getMatchesStatistics());
    }

    @GetMapping("/stats/revenue")
    public ResponseEntity<Map<String, BigDecimal>> getRevenueStats() {
        return ResponseEntity.ok(matchService.getRevenueStatistics());
    }

    @GetMapping("/stats/spectators")
    public ResponseEntity<Map<String, Integer>> getSpectatorsStats() {
        return ResponseEntity.ok(matchService.getSpectatorsStatistics());
    }

    @GetMapping("/stats/monthly-revenue")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyRevenue() {
        return ResponseEntity.ok(matchService.getMonthlyRevenue());
    }
}