package hello.hello_spring.Service;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Repository.WorkTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WorkTimeService {

    private static final Logger logger = LoggerFactory.getLogger(WorkTimeService.class);

    // 종료 버튼을 누르지 않고 10시간이 지나면 자동으로 작업이 종료되도록 설정
    private static final Duration MAX_WORK_DURATION = Duration.ofHours(10); // 최대 작업 시간 설정


    @Autowired
    private WorkTimeRepository workTimeRepository;

    public WorkTimeService() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

    public WorkTime startWork() {
        WorkTime workTime = new WorkTime();
        workTime.setStartTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        return workTimeRepository.save(workTime);
    }

    public WorkTime endWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            if (workTime.getEndTime() == null) {
                Duration duration = Duration.between(workTime.getStartTime(), LocalDateTime.now(ZoneId.of("Asia/Seoul")));
                if (duration.compareTo(MAX_WORK_DURATION) > 0) {
                    workTime.setEndTime(workTime.getStartTime().plus(MAX_WORK_DURATION));
                    logger.info("Max work duration exceeded. Auto-ending work time for ID {}: {}", id, workTime.getEndTime());
                } else {
                    workTime.setEndTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
                }
            }
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }


    /*
    public WorkTime endWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            if (workTime.getEndTime() == null) {
                // Check if the time since start is more than AUTO_END_DURATION
                Duration duration = Duration.between(workTime.getStartTime(), LocalDateTime.now(ZoneId.of("Asia/Seoul")));
                if (duration.compareTo(AUTO_END_DURATION) > 0) {
                    workTime.setEndTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
                    logger.info("Auto-ending work time for ID {}: {}", id, workTime.getEndTime());
                }
            }
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }

     */

    /*
    public WorkTime endWork(Long id) {
        Optional<WorkTime> optionalWorkTime = workTimeRepository.findById(id);
        if (optionalWorkTime.isPresent()) {
            WorkTime workTime = optionalWorkTime.get();
            workTime.setEndTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
            return workTimeRepository.save(workTime);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkTime not found");
    }

     */

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
        LocalDateTime startOfDay = date.atStartOfDay(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX).atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        return workTimeRepository.findAll().stream()
                .filter(workTime -> !workTime.getStartTime().isBefore(startOfDay) && !workTime.getStartTime().isAfter(endOfDay))
                .filter(workTime -> {
                    Duration duration = Duration.between(workTime.getStartTime(), workTime.getEndTime());
                    return duration.compareTo(MAX_WORK_DURATION) <= 0;
                })
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
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
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

    public Map<String, Long> getWeeklyWorkHours(LocalDate startDate) {
        Map<String, Long> weeklyWorkDurations = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            weeklyWorkDurations.put(day.name(), 0L);
        }

        LocalDate endDate = startDate.plusDays(6);
        List<WorkTime> workTimes = workTimeRepository.findAll().stream()
                .filter(workTime -> !workTime.getStartTime().toLocalDate().isBefore(startDate) &&
                        !workTime.getStartTime().toLocalDate().isAfter(endDate))
                .filter(workTime -> {
                    LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now();
                    Duration duration = Duration.between(workTime.getStartTime(), endTime);
                    return duration.compareTo(MAX_WORK_DURATION) <= 0;
                })
                //.filter(workTime -> Duration.between(workTime.getStartTime(), workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now()).compareTo(MAX_WORK_DURATION) <= 0)
                .collect(Collectors.toList());

        for (WorkTime workTime : workTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            long effectiveSeconds = workTime.getEffectiveWorkDurationSeconds();

            DayOfWeek day = startTime.getDayOfWeek();
            weeklyWorkDurations.put(day.name(), weeklyWorkDurations.get(day.name()) + effectiveSeconds);
        }

        // 로그 추가
        logger.info("Weekly Work Durations from {} to {}: {}", startDate, endDate, weeklyWorkDurations);
        return weeklyWorkDurations;
    }
    public Map<String, Long> getMonthlyWorkHours(int year) {
        Map<String, Long> monthlyWorkDurations = new LinkedHashMap<>();
        for (Month month : Month.values()) {
            monthlyWorkDurations.put(month.name(), 0L);
        }

        List<WorkTime> workTimes = workTimeRepository.findAll().stream()
                .filter(workTime -> workTime.getStartTime().getYear() == year)
                .filter(workTime -> Duration.between(workTime.getStartTime(), workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now()).compareTo(MAX_WORK_DURATION) <= 0)
                .collect(Collectors.toList());

        for (WorkTime workTime : workTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            long effectiveSeconds = workTime.getEffectiveWorkDurationSeconds();

            Month month = startTime.getMonth();
            monthlyWorkDurations.put(month.name(), monthlyWorkDurations.get(month.name()) + effectiveSeconds);
        }

        // 로그 추가
        logger.info("Monthly Work Durations for {}: {}", year, monthlyWorkDurations);
        return monthlyWorkDurations;
    }
}
