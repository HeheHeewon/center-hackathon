package hello.hello_spring.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Controller
public class VideoApiController {

    @Value("${youtube.api.key}")
    private String apiKey;

    @GetMapping("/stretching")
    public String getStretchingPage(@RequestParam(required = false, defaultValue = "안구 스트레칭") String keyword, Model model) {
        String url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + keyword + "&type=video&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("items")) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (!items.isEmpty()) {
                Map<String, Object> item = items.get(0);
                Map<String, Object> id = (Map<String, Object>) item.get("id");
                model.addAttribute("videoId", id.get("videoId"));
                System.out.println("Fetched videoId: " + id.get("videoId"));  // 로그 추가
            }
        }

        return "stretching/stretching";
    }
}
