package com.example.centerthon.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserResponse {
    private Long id;
    private String email;

    public UserResponse(Long id, String email) {
        this.id=id;
        this.email=email;
    }
}
