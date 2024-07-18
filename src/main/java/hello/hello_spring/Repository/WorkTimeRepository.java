package hello.hello_spring.Repository;

import hello.hello_spring.entity.WorkTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {

    @Query("SELECT w FROM WorkTime w WHERE w.startTime BETWEEN :start AND :end")
    List<WorkTime> findAllByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}