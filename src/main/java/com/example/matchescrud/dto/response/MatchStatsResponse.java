package com.example.matchescrud.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchStatsResponse {
    private long totalMatches;
    private long upcomingMatches;
    private long completedMatches;
    private Map<String, Integer> matchesPerTeam;
    private BigDecimal totalRevenue;
    private int totalSpectators;
    private double averageSpectators;
}