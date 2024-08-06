package hello.hello_spring.Controller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class TimerController {

    @GetMapping("/timer")
    public String timer(@RequestParam(value = "time", defaultValue = "10") Integer time, Model model) {
        model.addAttribute("initialTime", time); // 사용자로부터 받은 시간 또는 기본값으로 설정
        return "timer/timer";
    }
}

