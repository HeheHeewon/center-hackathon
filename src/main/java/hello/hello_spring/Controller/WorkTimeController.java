package hello.hello_spring.Controller;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Service.WorkTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import hello.hello_spring.Controller.WorkTimeController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Provider;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worktime")
public class WorkTimeController {

    @Autowired
    private WorkTimeService workTimeService;

    @PostMapping("/start")
    public WorkTime startWork() {
        return workTimeService.startWork();
    }

    @PostMapping("/end/{id}")
    public WorkTime endWork(@PathVariable Long id) {
        return workTimeService.endWork(id);
    }

    @PostMapping("/pause/{id}")
    public WorkTime pauseWork(@PathVariable Long id) {
        return workTimeService.pauseWork(id);
    }

    @PostMapping("/resume/{id}")
    public WorkTime resumeWork(@PathVariable Long id) {
        return workTimeService.resumeWork(id);
    }

    @GetMapping
    public List<WorkTime> getAllWorkTimes() {
        return workTimeService.getAllWorkTimes();
    }

    @GetMapping("/daily")
    public Map<Integer, Long> getDailyWorkHours(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        return workTimeService.getDailyWorkHours(localDate);
    }

    @GetMapping("/weekly")
    public Map<String, Long> getWeeklyWorkHours(@RequestParam("startDate") String startDate) {
        LocalDate start = LocalDate.parse(startDate);
        return workTimeService.getWeeklyWorkHours(start);
    }

    @GetMapping("/monthly")
    public Map<String, Long> getMonthlyWorkHours(@RequestParam int year) {
        return workTimeService.getMonthlyWorkHours(year);
    }

    @GetMapping("/workedDays")
    public List<LocalDate> getWorkedDaysInMonth(@RequestParam int year, @RequestParam int month) {
        return workTimeService.getWorkedDaysInMonth(year, month);
    }

    @GetMapping("/workedDaysAndHours")
    public Map<LocalDate, Map<String, Long>> getWorkedDaysAndHours(@RequestParam int year, @RequestParam int month) {
        return workTimeService.getWorkedDaysAndHours(year, month);
    }

}