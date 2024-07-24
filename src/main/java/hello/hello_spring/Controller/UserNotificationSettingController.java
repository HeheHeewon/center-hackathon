package hello.hello_spring.Controller;

import hello.hello_spring.Service.UserNotificationSettingService;
import hello.hello_spring.entity.UserNotificationSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notification")
public class UserNotificationSettingController {

    @Autowired
    private UserNotificationSettingService service;

    @GetMapping("/{userId}")
    public UserNotificationSetting getNotificationSetting(@PathVariable Long userId) {
        return service.getNotificationSetting(userId);
    }

    @PostMapping("/{userId}")
    public UserNotificationSetting updateNotificationSetting(@PathVariable Long userId, @RequestBody int interval) {
        // int interval = request.get("interval");
        return service.updateNotificationSetting(userId, interval);
    }
}