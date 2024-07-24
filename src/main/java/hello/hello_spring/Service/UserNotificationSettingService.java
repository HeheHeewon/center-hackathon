package hello.hello_spring.Service;

import hello.hello_spring.Repository.UserNotificationSettingRepository;
import hello.hello_spring.entity.UserNotificationSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserNotificationSettingService {

    @Autowired
    private UserNotificationSettingRepository repository;

    public UserNotificationSetting getNotificationSetting(Long userId) {
        return repository.findByUserId(userId).orElseGet(() -> {
            UserNotificationSetting setting = new UserNotificationSetting();
            setting.setUserId(userId);
            setting.setNotificationInterval(30); // 기본값 30분
            return repository.save(setting);
        });
    }

    public UserNotificationSetting updateNotificationSetting(Long userId, int interval) {
        UserNotificationSetting setting = repository.findByUserId(userId).orElseGet(() -> {
            UserNotificationSetting newSetting = new UserNotificationSetting();
            newSetting.setUserId(userId);
            return newSetting;
        });
        setting.setNotificationInterval(interval);
        return repository.save(setting);
    }
}