package hello.hello_spring.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthProvider implements AuthenticationProvider {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthProvider.class);

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomAuthProvider(@Qualifier("userSecurityService") UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        // 디버깅 로그 추가
        logger.info("Received username (email): {}", username);
        logger.info("Received password: {}", password);

        if (username == null || username.isEmpty()) {
            logger.error("Username is null or empty");
            throw new BadCredentialsException("Username not provided");
        }

        UserDetails user = userDetailsService.loadUserByUsername(username);
        if (user == null) {
            logger.error("User not found: {}", username);
            throw new BadCredentialsException("User not found.");
        }

        logger.info("Hashed password from DB: {}", user.getPassword());

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.error("Invalid password for user: {}", username);
            throw new BadCredentialsException("Invalid password.");
        }

        logger.info("User authenticated successfully: {}", username);
        return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
