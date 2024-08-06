package hello.hello_spring.Controller;

import hello.hello_spring.Service.UserService;
import hello.hello_spring.dto.PasswordResetRequest;
import hello.hello_spring.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController  // RestController로 변경
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/signup")
    public String registerUser(Model model) {
        model.addAttribute("SignupRequest", new SignupRequest());
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
            response.put("redirectUrl", "http://localhost:8080/");
            return ResponseEntity.ok().body(response);
        } catch (IllegalStateException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/login")
    public String login() {
        return "user/login";
    }

    @GetMapping("/login/error")
    public String loginError(Model model) {
        model.addAttribute("loginErrorMsg", "아이디 또는 비밀번호를 확인해주세요.");
        return "user/login";
    }

//    @PostMapping("/login")
//    @ResponseBody
//    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
//        try {
//            UsernamePasswordAuthenticationToken authenticationToken =
//                    new UsernamePasswordAuthenticationToken(loginRequest.get("email"), loginRequest.get("password"));
//
//            Authentication authentication = authenticationManager.authenticate(authenticationToken);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            Map<String, String> response = new HashMap<>();
//            response.put("message", "Login successful");
//            return ResponseEntity.ok().body(response);
//        } catch (AuthenticationException e) {
//            Map<String, String> response = new HashMap<>();
//            response.put("message", "Login failed");
//            return ResponseEntity.status(401).body(response);
//        }
//    }

    @GetMapping("/reset")
    public String resetPassword(Model model) {
        model.addAttribute("PasswordResetRequest", new PasswordResetRequest());
        return "user/reset";
    }

    @PostMapping("/reset")
    @ResponseBody
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
