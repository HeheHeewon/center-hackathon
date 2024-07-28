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
    // 종료 버튼을 누르지 않고 7시간이 지나면 자동으로 작업이 종료되도록 설정
    private static final Duration MAX_WORK_DURATION = Duration.ofHours(7); // 최대 작업 시간 설정

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
                .filter(workTime -> {
                    LocalDateTime startTime = workTime.getStartTime();
                    LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
                    if (startTime == null || endTime == null) {
                        return false;
                    }
                    return !startTime.isBefore(startOfDay) && !startTime.isAfter(endOfDay);
                })
                .filter(workTime -> {
                    LocalDateTime startTime = workTime.getStartTime();
                    LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
                    Duration duration = Duration.between(startTime, endTime);
                    return duration.compareTo(MAX_WORK_DURATION) <= 0;
                })
                .collect(Collectors.toList());
    }

    // 일간 데이터

    public Map<Integer, Long> getDailyWorkHours(LocalDate date) {
        List<WorkTime> dailyWorkTimes = getDailyWorkTimes(date);
        Map<Integer, Long> hourlyWorkDurations = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            hourlyWorkDurations.put(hour, 0L);
        }

        for (WorkTime workTime : dailyWorkTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() :
                    LocalDateTime.now(ZoneId.of("Asia/Seoul"));
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

                long currentDuration = hourlyWorkDurations.get(hour);
                long newDuration = currentDuration + duration;
                hourlyWorkDurations.put(hour, Math.min(newDuration, 3600L)); // 시간당 최대 3600초 (60분)으로 제한
                startTime = nextHour;
                effectiveSeconds -= duration;
            }
        }
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

    // 주간 데이터

    public Map<String, Long> getWeeklyWorkHours(LocalDate startDate) {
        Map<String, Long> weeklyWorkDurations = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            weeklyWorkDurations.put(day.name(), 0L);
        }

        LocalDate endDate = startDate.plusDays(6);

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Map<Integer, Long> dailyWorkHours = getDailyWorkHours(date);
            long dailyTotalSeconds = dailyWorkHours.values().stream().mapToLong(Long::longValue).sum();
            DayOfWeek day = date.getDayOfWeek();
            long currentDuration = weeklyWorkDurations.get(day.name());
            long newDuration = currentDuration + dailyTotalSeconds;
            weeklyWorkDurations.put(day.name(), newDuration);
        }

        long totalWeeklySeconds = weeklyWorkDurations.values().stream().mapToLong(Long::longValue).sum();
        logger.info("Weekly Work Durations from {} to {}: {}", startDate, endDate, weeklyWorkDurations);
        return weeklyWorkDurations;
    }


    /*
    // 주간 데이터
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
                .collect(Collectors.toList());

        for (WorkTime workTime : workTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            long effectiveSeconds = workTime.getEffectiveWorkDurationSeconds();

            while (startTime.isBefore(endTime) && effectiveSeconds > 0) {
                DayOfWeek day = startTime.getDayOfWeek();
                LocalDateTime nextHour = startTime.withMinute(0).withSecond(0).plusHours(1);
                if (nextHour.isAfter(endTime)) {
                    nextHour = endTime;
                }
                long duration = ChronoUnit.SECONDS.between(startTime, nextHour);
                if (duration > effectiveSeconds) {
                    duration = effectiveSeconds;
                }

                long currentDuration = weeklyWorkDurations.get(day.name());
                long newDuration = currentDuration + duration;
                weeklyWorkDurations.put(day.name(), Math.min(newDuration, 3600L)); // 시간당 최대 3600초 (60분)으로 제한
                startTime = nextHour;
                effectiveSeconds -= duration;
            }
        }

        long totalWeeklySeconds = weeklyWorkDurations.values().stream().mapToLong(Long::longValue).sum();
        logger.info("Weekly Work Durations from {} to {}: {}", startDate, endDate, weeklyWorkDurations);
        return weeklyWorkDurations;
    }
    */

    // 월간 데이터
    /*
    public Map<String, Long> getMonthlyWorkHours(int year, int month) {
        Map<String, Long> monthlyWorkDurations = new LinkedHashMap<>();
        for (Month m : Month.values()) {
            monthlyWorkDurations.put(m.name(), 0L);
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Map<Integer, Long> dailyWorkHours = getDailyWorkHours(date);
            long dailyTotalSeconds = dailyWorkHours.values().stream().mapToLong(Long::longValue).sum();
            Month currentMonth = date.getMonth();
            long currentDuration = monthlyWorkDurations.get(currentMonth.name());
            long newDuration = currentDuration + dailyTotalSeconds;
            monthlyWorkDurations.put(currentMonth.name(), newDuration);
        }

        logger.info("Monthly Work Durations for {}-{}: {}", year, month, monthlyWorkDurations);
        return monthlyWorkDurations;
    }

     */

    public Map<String, Long> getMonthlyWorkHours(int year) {
        Map<String, Long> monthlyWorkDurations = new LinkedHashMap<>();
        for (Month month : Month.values()) {
            monthlyWorkDurations.put(month.name(), 0L);
        }

        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        for (LocalDate date = startOfYear; !date.isAfter(endOfYear); date = date.plusDays(1)) {
            Map<Integer, Long> dailyWorkHours = getDailyWorkHours(date);
            long dailyTotalSeconds = dailyWorkHours.values().stream().mapToLong(Long::longValue).sum();
            Month currentMonth = date.getMonth();
            long currentDuration = monthlyWorkDurations.get(currentMonth.name());
            long newDuration = currentDuration + dailyTotalSeconds;
            monthlyWorkDurations.put(currentMonth.name(), newDuration);

            logger.info("Date: {}, Total Seconds: {}, Current Month: {}, New Duration: {}", date, dailyTotalSeconds, currentMonth, newDuration);
        }

        logger.info("Monthly Work Durations for year {}: {}", year, monthlyWorkDurations);
        return monthlyWorkDurations;
    }

/* 이전에 쓰던 1코드
    public Map<String, Long> getMonthlyWorkHours(int year) {
        Map<String, Long> monthlyWorkDurations = new LinkedHashMap<>();
        for (Month month : Month.values()) {
            monthlyWorkDurations.put(month.name(), 0L);
        }

        List<WorkTime> workTimes = workTimeRepository.findAll().stream()
                .filter(workTime -> workTime.getStartTime().getYear() == year)
                .filter(workTime -> {
                    LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
                    return Duration.between(workTime.getStartTime(), endTime).compareTo(MAX_WORK_DURATION) <= 0;
                })
                .collect(Collectors.toList());

        for (WorkTime workTime : workTimes) {
            LocalDateTime startTime = workTime.getStartTime();
            LocalDateTime endTime = workTime.getEndTime() != null ? workTime.getEndTime() : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            long effectiveSeconds = workTime.getEffectiveWorkDurationSeconds();

            Month month = startTime.getMonth();
            long currentDuration = monthlyWorkDurations.get(month.name());
            long newDuration = currentDuration + effectiveSeconds;
            monthlyWorkDurations.put(month.name(), Math.min(newDuration, 3600L * 24 * startTime.toLocalDate().lengthOfMonth())); // 월간 최대 초 제한
        }

        logger.info("Monthly Work Durations for {}: {}", year, monthlyWorkDurations);
        return monthlyWorkDurations;
    }

 */


    // 시간 기능 위해 추가 코드
    public long calculateEffectiveWorkDuration(LocalDateTime startTime, LocalDateTime endTime, Duration totalPauseDuration) {
        if (startTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            Duration workDuration = Duration.between(startTime, effectiveEndTime);
            Duration pauseDuration = totalPauseDuration != null ? totalPauseDuration : Duration.ZERO;

            Duration effectiveWorkDuration = workDuration.minus(pauseDuration);
            return effectiveWorkDuration.getSeconds();
        }
        return 0;
    }

    public long calculateTotalWorkDuration(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime != null) {
            LocalDateTime effectiveEndTime = endTime != null ? endTime : LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            Duration workDuration = Duration.between(startTime, effectiveEndTime);
            return workDuration.getSeconds();
        }
        return 0;
    }

    public long calculateTotalPauseDuration(Duration totalPauseDuration) {
        return (totalPauseDuration != null ? totalPauseDuration : Duration.ZERO).getSeconds();
    }

    public Map<LocalDate, Map<String, Long>> getWorkedDaysAndHours(int year, int month) {
        List<LocalDate> workedDaysInMonth = getWorkedDaysInMonth(year, month);
        Map<LocalDate, Map<String, Long>> workedDaysAndHours = new LinkedHashMap<>();

        for (LocalDate date : workedDaysInMonth) {
            Map<Integer, Long> dailyWorkHours = getDailyWorkHours(date);
            long totalDailySeconds = dailyWorkHours.values().stream().mapToLong(Long::longValue).sum();
            long hours = totalDailySeconds / 3600;
            long minutes = (totalDailySeconds % 3600) / 60;
            long remainingSeconds = totalDailySeconds % 60;
            Map<String, Long> timeMap = new HashMap<>();
            timeMap.put("hours", hours);
            timeMap.put("minutes", minutes);
            timeMap.put("seconds", remainingSeconds); // 초 단위 추가
            workedDaysAndHours.put(date, timeMap);

            logger.info("Worked day: {}, Total seconds: {}, Hours: {}, Minutes: {}, Seconds: {}", date, totalDailySeconds, hours, minutes, remainingSeconds); // 로그 추가
        }

        return workedDaysAndHours;
    }
}
