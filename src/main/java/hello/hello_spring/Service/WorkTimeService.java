package hello.hello_spring.Service;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Repository.WorkTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

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
}

    // 일일 근무 시간 데이터 가져오기
    // public List<WorkTime> getDailyWorkTimes(LocalDateTime date) {
        // LocalDateTime start = date.truncatedTo(ChronoUnit.DAYS);
        // LocalDateTime end = start.plusDays(1);
        // return workTimeRepository.findAllByStartTimeBetween(start, end);
    // }

    // 주간 근무 시간 데이터 가져오기
    // public List<WorkTime> getWeeklyWorkTimes(LocalDateTime date) {
        // LocalDateTime start = date.with(java.time.DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS);
        // LocalDateTime end = start.plusWeeks(1);
        // return workTimeRepository.findAllByStartTimeBetween(start, end);
    // }

    // 월간 근무 시간 데이터 가져오기
    // public List<WorkTime> getMonthlyWorkTimes(LocalDateTime date) {
        // LocalDateTime start = date.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        // LocalDateTime end = start.plusMonths(1);
        // return workTimeRepository.findAllByStartTimeBetween(start, end);
    // }
// }