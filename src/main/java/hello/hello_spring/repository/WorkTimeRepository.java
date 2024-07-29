package hello.hello_spring.repository;

import hello.hello_spring.entity.WorkTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {
    @Query("SELECT w FROM WorkTime w WHERE w.startTime >= :start AND w.endTime <= :end")
    List<WorkTime> findWorkTimesWithinPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}