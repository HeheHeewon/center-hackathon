package hello.hello_spring.Repository;

import hello.hello_spring.entity.WorkTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {
}