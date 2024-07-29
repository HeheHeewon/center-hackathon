package hello.hello_spring.dto;

import lombok.Getter;

@Getter
public class UserResponse {
    private Long id;
    private String email;

    public UserResponse(Long id, String email) {
        this.id=id;
        this.email=email;
    }
}
