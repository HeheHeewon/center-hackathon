package hello.hello_spring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.Temporal;

@Entity
@Getter
@Setter
public class WorkTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isPaused = false; // 기본값 설정; // 일시 정지 상태를 나타내는 플래그
    private Duration totalPauseDuration = Duration.ZERO;
    private LocalDateTime lastPauseTime;



    public void pause() {
        if (!isPaused) {
            this.lastPauseTime = LocalDateTime.now();
            this.isPaused = true;
        }
    }

    public void resume() {
        if (isPaused && lastPauseTime != null) {
            Duration pauseDuration = Duration.between(lastPauseTime, LocalDateTime.now(ZoneId.of("Asia/Seoul")));
            totalPauseDuration = totalPauseDuration.plus(pauseDuration);
            this.isPaused = false;
            // this.lastPauseTime = null;
            // lastPauseTime = LocalDateTime.now(ZoneId.of("Asia/Seoul")); // Update lastPauseTime to now after resuming

        }
    }

    @JsonProperty("effectiveWorkDurationInSeconds")
    public long getEffectiveWorkDurationSeconds() {
        if (startTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            Duration workDuration = Duration.between(startTime, effectiveEndTime);
            return workDuration.minus(totalPauseDuration != null ? totalPauseDuration : Duration.ZERO).getSeconds();
        }
        return 0;
    }

    @JsonProperty("totalWorkDurationInSeconds")
    public long getTotalWorkDuration() {
        if (startTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            return Duration.between(startTime, effectiveEndTime).getSeconds();
        }
        return 0;
    }

    @JsonProperty("totalPauseDurationInSeconds")
    public long getTotalPauseDurationInSeconds() {
        return (totalPauseDuration != null ? totalPauseDuration : Duration.ZERO).getSeconds();
    }
}

