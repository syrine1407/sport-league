package com.example.matchescrud.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class StadiumDTO {
    private Long id;
    private String name;
    private int capacity;
    private double latitude;  // New field
    private double longitude; // New field
    private String address;   // New field
}
