package com.example.centerthon.controller;
import com.example.centerthon.dto.SignupRequest;
import com.example.centerthon.dto.UserResponse;
import com.example.centerthon.entity.User;
import com.example.centerthon.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("")
@Controller
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/signup")
    public String registerUser(Model model) {
        model.addAttribute("SignupRequset", new SignupRequest());
        return "user/signup";

    }
    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        Map<String, String> response = new HashMap<>();
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
        }

        try {
            userService.createUser(signupRequest, passwordEncoder);
            response.put("redirectUrl", "http://localhost:8080/"); // 클라이언트 요청에 따라 리디렉션 URL 포함
            return ResponseEntity.ok().body(response);
        } catch (IllegalStateException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/login")
    public String login(){
        return "user/login";
    }
    @GetMapping("/login/error")
    public String loginError(Model model){
        model.addAttribute("loginErrorMsg","아이디 또는 비밀번호를 확인해주세요.");
        return "/user/login";

    }


}

