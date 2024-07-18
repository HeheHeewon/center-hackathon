package hello.hello_spring.Controller;

import hello.hello_spring.Service.NotificationGuideService;
import hello.hello_spring.entity.NotificationGuide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide")
public class NotificationGuideController {
    @Autowired
    private NotificationGuideService service;

    @GetMapping
    public List<NotificationGuide> getAllGuides() {
        return service.getAllGuides();
    }
}