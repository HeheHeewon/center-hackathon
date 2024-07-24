package hello.hello_spring.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;

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

    /*
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public boolean isPaused() { return isPaused; }
    public void setPaused(boolean paused) { isPaused = paused; }
    public Duration getTotalPauseDuration() { return totalPauseDuration; }
    public void setTotalPauseDuration(Duration totalPauseDuration) { this.totalPauseDuration = totalPauseDuration; }
    public LocalDateTime getLastPauseTime() { return lastPauseTime; }
    public void setLastPauseTime(LocalDateTime lastPauseTime) { this.lastPauseTime = lastPauseTime; }
     */

    public void pause() {
        if (!isPaused) {
            this.lastPauseTime = LocalDateTime.now();
            this.isPaused = true;
        }
    }

    public void resume() {
        if (isPaused && lastPauseTime != null) {
            Duration pauseDuration = Duration.between(lastPauseTime, LocalDateTime.now());
            totalPauseDuration = totalPauseDuration.plus(pauseDuration);
            this.lastPauseTime = null;
            this.isPaused = false;
        }
    }

    public Duration getEffectiveWorkDuration() {
        if (startTime != null && endTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now();
            Duration workDuration = Duration.between(startTime, effectiveEndTime);
            return workDuration.minus(totalPauseDuration != null ? totalPauseDuration : Duration.ZERO);
        }
        return Duration.ZERO;
    }
    public Duration getTotalWorkDuration() {
        if (startTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now();
            return Duration.between(startTime, effectiveEndTime);
        }
        return Duration.ZERO;
    }
}