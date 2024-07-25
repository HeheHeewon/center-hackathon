package hello.hello_spring.Service;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Repository.WorkTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WorkTimeService {

    private static final Logger logger = LoggerFactory.getLogger(WorkTimeService.class);

    @Autowired
    private WorkTimeRepository workTimeRepository;

    public WorkTimeService() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

    public WorkTime startWork() {
        WorkTime workTime = new WorkTime();
        workTime.setStartTime(LocalDateTime.now());
        return workTimeRepository.save(workTime);
    }

    public WorkTime endWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            workTime.setEndTime(LocalDateTime.now());
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }

    public WorkTime pauseWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            workTime.pause();
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }

    public WorkTime resumeWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            workTime.resume();
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }

    public List<WorkTime> getAllWorkTimes() {
        return workTimeRepository.findAll();
    }

    public List<WorkTime> getDailyWorkTimes(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return workTimeRepository.findAll().stream()
                .filter(workTime -> !workTime.getStartTime().isBefore(startOfDay) && !workTime.getStartTime().isAfter(endOfDay))
                .collect(Collectors.toList());
    }

    public Map<Integer, Long> getDailyWorkHours(LocalDate date) {
        List<WorkTime> dailyWorkTimes = getDailyWorkTimes(date);
        Map<Integer, Long> hourlyWorkDurations = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            hourlyWorkDurations.put(hour, 0L);
        }
        for (WorkTime workTime : dailyWorkTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now();
            long effectiveSeconds = workTime.getEffectiveWorkDurationSeconds(); // 유효한 근무 시간

            while (startTime.isBefore(endTime) && effectiveSeconds > 0) {
                int hour = startTime.getHour();
                LocalDateTime nextHour = startTime.withMinute(0).withSecond(0).plusHours(1);
                if (nextHour.isAfter(endTime)) {
                    nextHour = endTime;
                }
                long duration = ChronoUnit.SECONDS.between(startTime, nextHour);
                if (duration > effectiveSeconds) {
                    duration = effectiveSeconds;
                }
                hourlyWorkDurations.put(hour, hourlyWorkDurations.get(hour) + duration);
                startTime = nextHour;
                effectiveSeconds -= duration;
            }
        }
        // 로그 추가
        logger.info("Hourly Work Durations for {}: {}", date, hourlyWorkDurations);
        return hourlyWorkDurations;
    }

    public List<LocalDate> getWorkedDaysInMonth(int year, int month) {
        return workTimeRepository.findAll().stream()
                .map(workTime -> workTime.getStartTime().toLocalDate())
                .filter(date -> date.getYear() == year && date.getMonthValue() == month)
                .distinct()
                .collect(Collectors.toList());
    }
}
