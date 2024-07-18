package hello.hello_spring.Service;

import hello.hello_spring.Repository.NotificationGuideRepository;
import hello.hello_spring.entity.NotificationGuide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class NotificationGuideService {
    @Autowired
    private NotificationGuideRepository repository;

    public List<NotificationGuide> getAllGuides() {
        return repository.findAll();
    }
}
