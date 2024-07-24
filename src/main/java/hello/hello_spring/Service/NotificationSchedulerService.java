package hello.hello_spring.Service;

import hello.hello_spring.entity.UserNotificationSetting;
import hello.hello_spring.Repository.UserNotificationSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationSchedulerService {

    @Autowired
    private UserNotificationSettingRepository repository;

    // 예시: 1분마다 실행
    @Scheduled(fixedRate = 60000)
    public void sendReminders() {
        List<UserNotificationSetting> settings = repository.findAll();
        for (UserNotificationSetting setting : settings) {
            // 알림 주기 (분) 단위로 계산
            if (shouldSendReminder(setting)) {
                sendReminder(setting);
            }
        }
    }

    private boolean shouldSendReminder(UserNotificationSetting setting) {
        // 주기마다 알림을 보내도록 로직 구현
        // 예시: 현재 시간을 기준으로 설정된 주기마다 알림을 보낸다고 가정
        // 현재 시간과 마지막 알림 시간 등을 비교하여 알림 여부 결정
        return true; // 실제 로직을 구현해야 함
    }

    private void sendReminder(UserNotificationSetting setting) {
        // 알림을 보내는 로직 구현 (예: 이메일, 푸시 알림 등)
        System.out.println("Sending reminder to user " + setting.getUserId() + " with interval " + setting.getNotificationInterval());
    }
}
