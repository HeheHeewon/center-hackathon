package hello.hello_spring.Service;

import hello.hello_spring.dto.SignupRequest;
import hello.hello_spring.dto.PasswordResetRequest;
import hello.hello_spring.entity.User;
import hello.hello_spring.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public  User createUser(SignupRequest signupRequest, PasswordEncoder passwordEncoder) {
        User user = new User(signupRequest.getEmail().toString(), passwordEncoder.encode(signupRequest.getPassword().toString()));
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
}
