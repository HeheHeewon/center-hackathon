package hello.hello_spring.Service;

import hello.hello_spring.dto.PasswordResetRequest;
import hello.hello_spring.dto.SignupRequest;
import hello.hello_spring.entity.User;
import hello.hello_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(SignupRequest signupRequest, PasswordEncoder passwordEncoder) {
        User user = new User(signupRequest.getEmail(), passwordEncoder.encode(signupRequest.getPassword()));
        validateDuplicateMember(user);
        // 사용자 생성 로직
        return userRepository.save(user);
    }

    private void validateDuplicateMember(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalStateException("이미 가입된 회원입니다.");
        }
    }

    public void resetPassword(PasswordResetRequest passwordResetRequest) {
        User user = userRepository.findByEmail(passwordResetRequest.getEmail());
        if (user == null) {
            throw new UsernameNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
        }

        user.setPassword(passwordEncoder.encode(passwordResetRequest.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }

        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}
