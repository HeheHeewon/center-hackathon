package hello.hello_spring.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import hello.hello_spring.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
}
