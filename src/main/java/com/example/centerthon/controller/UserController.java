package com.example.centerthon.controller;
import com.example.centerthon.dto.PasswordResetRequest;
import com.example.centerthon.dto.SignupRequest;
import com.example.centerthon.dto.UserResponse;
import com.example.centerthon.entity.User;
import com.example.centerthon.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
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
    @GetMapping("/reset")
    public String resetPassword(Model model) {
        model.addAttribute("PasswordResetRequest", new PasswordResetRequest());
        return "user/reset";

    }
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@Validated @RequestBody PasswordResetRequest passwordResetRequest) {
        if (!passwordResetRequest.getNewPassword().equals(passwordResetRequest.getConfirmPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "비밀번호 불일치");
            response.put("message", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            userService.resetPassword(passwordResetRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", "비밀번호 변경 성공");
            response.put("redirectUrl", "http://localhost:8080/login");
            return ResponseEntity.ok().body(response);
        } catch (UsernameNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "사용자 없음");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "오류 발생");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


}

