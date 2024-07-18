package hello.hello_spring.Service;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Repository.WorkTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class WorkTimeService {
    @Autowired
    private WorkTimeRepository workTimeRepository;

    public WorkTime startWork() {
        WorkTime workTime = new WorkTime();
        workTime.setStartTime(LocalDateTime.now());
        return workTimeRepository.save(workTime);
    }

    public WorkTime endWork(Long id) {
        WorkTime workTime = workTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Work time not found"));
        workTime.setEndTime(LocalDateTime.now());
        return workTimeRepository.save(workTime);
    }

    public List<WorkTime> getAllWorkTimes() {

        return workTimeRepository.findAll();
    }

    // 일일 근무 시간 데이터 가져오기
    public List<WorkTime> getDailyWorkTimes(LocalDateTime date) {
        LocalDateTime start = date.truncatedTo(ChronoUnit.DAYS);
        LocalDateTime end = start.plusDays(1);
        return workTimeRepository.findAllByStartTimeBetween(start, end);
    }

    // 주간 근무 시간 데이터 가져오기
    public List<WorkTime> getWeeklyWorkTimes(LocalDateTime date) {
        LocalDateTime start = date.with(java.time.DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime end = start.plusWeeks(1);
        return workTimeRepository.findAllByStartTimeBetween(start, end);
    }

    // 월간 근무 시간 데이터 가져오기
    public List<WorkTime> getMonthlyWorkTimes(LocalDateTime date) {
        LocalDateTime start = date.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime end = start.plusMonths(1);
        return workTimeRepository.findAllByStartTimeBetween(start, end);
    }
}