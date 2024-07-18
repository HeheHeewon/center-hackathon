package hello.hello_spring.Repository;

import hello.hello_spring.entity.NotificationGuide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationGuideRepository extends JpaRepository<NotificationGuide, Long> {
}