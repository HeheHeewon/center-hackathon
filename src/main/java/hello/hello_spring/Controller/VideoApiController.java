package hello.hello_spring.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class VideoApiController {

    @Value("${youtube.api.key}")
    private String apiKey;

    @GetMapping("/stretching")
    @ResponseBody
    public Map<String, List<String>> getStretchingPage(@RequestParam(required = false, defaultValue = "안구 스트레칭") String keyword) {
        String url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" + keyword + "&type=video&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("items")) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            List<String> videoIds = items.stream()
                    .map(item -> (Map<String, Object>) item.get("id"))
                    .map(id -> (String) id.get("videoId"))
                    .collect(Collectors.toList());
            return Map.of("videoIds", videoIds);
        }
        return Map.of("videoIds", List.of());
    }
}
