package com.example.centerthon.Service;

import com.example.centerthon.constant.Roll;
import com.example.centerthon.dto.SignupRequest;
import com.example.centerthon.entity.User;
import com.example.centerthon.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor //의존성 주입 중 생성자 주입을 코드 없이 자동
public class UserService {
    private final UserRepository userRepository;

    public  User createUser(SignupRequest signupRequest, PasswordEncoder passwordEncoder) {
        User user = new User(signupRequest.getEmail().toString(), passwordEncoder.encode(signupRequest.getPassword().toString()));
        validateDuplicateMember(user);
        // 사용자 생성 로직
        return userRepository.save(user);

    }
    private void validateDuplicateMember(User user) {
        User valiUser= userRepository.findByEmail(user.getEmail());
        if(valiUser!=null){
            throw new IllegalStateException("이미 가입된 회원입니다. ");
        }
    }
}
