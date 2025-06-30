package com.example.matchescrud.service;

import com.example.matchescrud.Mapper.MatchRequestMapper;
import com.example.matchescrud.Mapper.MatchResponseDTOMapper;
import com.example.matchescrud.dto.request.MatchRequestDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;
import com.example.matchescrud.dto.response.MatchStatsResponse;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.NotFoundExceptions.MatchNotFoundException;
import com.example.matchescrud.exceptions.NotFoundExceptions.TeamNotFoundException;
import com.example.matchescrud.exceptions.StadiumSizeException;
import com.example.matchescrud.model.entity.Match;
import com.example.matchescrud.model.entity.Team;
import com.example.matchescrud.repository.MatchRepository;
import com.example.matchescrud.repository.TeamRepository;
import com.example.matchescrud.service.interfaces.IMatchService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MatchServiceImp implements IMatchService {

    //Dependency injection
    MatchRepository matchRepository;
    TeamRepository teamRepository;
    MatchResponseDTOMapper matchResponseDTOMapper;
    MatchRequestMapper matchRequestMapper;

    public MatchServiceImp(MatchRepository matchRepository, TeamRepository teamRepository, MatchRequestMapper matchRequestMapper, MatchResponseDTOMapper matchResponseDTOMapper) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.matchRequestMapper = matchRequestMapper;
        this.matchResponseDTOMapper = matchResponseDTOMapper;
    }

    //GET
    @Transactional
    @Override
    public List<MatchResponseDTO> getAllMatches() {
        List<Match> matches = matchRepository.findAll();
        return matchResponseDTOMapper.matchListToMatchResponseDTOList(matches);
    }

    //GET
    @Transactional
    @Override
    public MatchResponseDTO getMatchByUUID(UUID uuid) throws ApiException {
        Match match = matchRepository.findById(uuid).orElseThrow(() -> new MatchNotFoundException(uuid));
        return matchResponseDTOMapper.matchToMatchResponseDTO(match);
    }

    //DELETE
    @Transactional
    @Override
    public MatchResponseDTO deleteMatch(UUID id) throws ApiException {
        Optional<Match> match = matchRepository.findById(id);
        if (match.isPresent()) {
            matchRepository.delete(match.get());
            return matchResponseDTOMapper.matchToMatchResponseDTO(match.get());
        }
        throw new MatchNotFoundException(id);
    }

    //POST
    @Transactional
    @Override
    public MatchResponseDTO createMatch(MatchRequestDTO matchRequestDTO) throws ApiException {
        // Map MatchRequestDTO to Match
        Match match = matchRequestMapper.matchRequestDTOtoMatch(matchRequestDTO);

        //Search matches by their ID on th DB
        Optional<Team> optionalHomeTeam = teamRepository.findById(match.getHomeTeam().getId());
        Optional<Team> optionalAwayTeam = teamRepository.findById(match.getAwayTeam().getId());

        Team homeTeam = optionalHomeTeam.orElseThrow(() -> new TeamNotFoundException(match.getHomeTeam().getId()));
        Team awayTeam = optionalAwayTeam.orElseThrow(() -> new TeamNotFoundException(match.getAwayTeam().getId()));

        //Set Random UUID
        match.setUuid(UUID.randomUUID());
        //Set HomeTeam stadium as match stadium
        if (match.getSpectators() > homeTeam.getStadium().getCapacity()) {
            throw new StadiumSizeException(match.getSpectators(), homeTeam.getStadium());
        }
        match.setStadium(homeTeam.getStadium());
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setTime(matchRequestDTO.getTime());
        match.setDate(matchRequestDTO.getDate());
        match.setHomeGoals(matchRequestDTO.getHomeGoals());
        match.setAwayGoals(matchRequestDTO.getAwayGoals());
        //Converts spectators number to BigDecimal
        BigDecimal spectatorsBigDecimal = BigDecimal.valueOf(matchRequestDTO.getSpectators());
        // Calculates match revenue multipliying spectators by TicketPrice
        match.setRevenue(spectatorsBigDecimal.multiply(matchRequestDTO.getTicketPrice()));


        Match matchResponse = matchRepository.save(match);

        //Add match to HomeTeam and AwayTeam match lists.
        addMatchToTeams(homeTeam, awayTeam, matchResponse);
        return matchResponseDTOMapper.matchToMatchResponseDTO(matchResponse);

    }

    public void addMatchToTeams(Team homeTeam, Team awayTeam, Match match) {
        homeTeam.getHomeMatches().add(match);
        awayTeam.getAwayMatches().add(match);
    }

    // Add these methods to your existing MatchServiceImp class

    @Override
    public MatchStatsResponse getMatchesStatistics() {
        List<Match> allMatches = matchRepository.findAll();

        long totalMatches = allMatches.size();
        long upcomingMatches = allMatches.stream()
                .filter(m -> m.getDate().isAfter(LocalDate.now()))
                .count();
        long completedMatches = totalMatches - upcomingMatches;

        Map<String, Integer> matchesPerTeam = allMatches.stream()
                .flatMap(m -> Stream.of(m.getHomeTeam().getName(), m.getAwayTeam().getName()))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.summingInt(e -> 1)));

        BigDecimal totalRevenue = allMatches.stream()
                .map(Match::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalSpectators = allMatches.stream()
                .mapToInt(Match::getSpectators)
                .sum();

        double averageSpectators = totalMatches > 0 ? (double) totalSpectators / totalMatches : 0;

        return new MatchStatsResponse(
                totalMatches,
                upcomingMatches,
                completedMatches,
                matchesPerTeam,
                totalRevenue,
                totalSpectators,
                averageSpectators
        );
    }

    @Override
    public Map<String, BigDecimal> getRevenueStatistics() {
        List<Match> allMatches = matchRepository.findAll();

        return allMatches.stream()
                .collect(Collectors.groupingBy(
                        m -> m.getDate().getMonth().toString(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Match::getRevenue,
                                BigDecimal::add
                        )
                ));
    }

    @Override
    public Map<String, Integer> getSpectatorsStatistics() {
        List<Match> allMatches = matchRepository.findAll();

        return allMatches.stream()
                .collect(Collectors.groupingBy(
                        m -> m.getDate().getMonth().toString(),
                        Collectors.summingInt(Match::getSpectators)
                ));
    }

    @Override
    public Map<String, BigDecimal> getMonthlyRevenue() {
        List<Object[]> results = matchRepository.getMonthlyRevenue();
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();

        for (Object[] result : results) {
            String month = (String) result[0];
            BigDecimal revenue = (BigDecimal) result[1];
            monthlyRevenue.put(month, revenue);
        }

        return monthlyRevenue;
    }
}
