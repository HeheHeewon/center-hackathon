package hello.hello_spring.Repository;

// import hello.hello_spring.entity.User;
import hello.hello_spring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
