package hello.hello_spring.Controller;

import hello.hello_spring.entity.WorkTime;
import hello.hello_spring.Service.WorkTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.security.Provider;
import java.time.LocalDateTime;
import java.util.List;

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

    @GetMapping
    public List<WorkTime> getAllWorkTimes() {
        return workTimeService.getAllWorkTimes();
    }

    @GetMapping("/daily")
    public List<WorkTime> getDailyWorkTimes(@RequestParam String date) {
        LocalDateTime dateTime = LocalDateTime.parse(date);
        return workTimeService.getDailyWorkTimes(dateTime);
    }

    @GetMapping("/weekly")
    public List<WorkTime> getWeeklyWorkTimes(@RequestParam String date) {
        LocalDateTime dateTime = LocalDateTime.parse(date);
        return workTimeService.getWeeklyWorkTimes(dateTime);
    }

    @GetMapping("/monthly")
    public List<WorkTime> getMonthlyWorkTimes(@RequestParam String date) {
        LocalDateTime dateTime = LocalDateTime.parse(date);
        return workTimeService.getMonthlyWorkTimes(dateTime);
    }
}
