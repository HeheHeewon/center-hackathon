package hello.hello_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class HelloSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelloSpringApplication.class, args);
	}

	// 중복 매핑이 있는지 확인합니다.
	// @RestController
	// public class HelloSpringApplicationController {
	//     @GetMapping("/hello")
	//     public String hello(String name) {
	//         return "Hello, " + name;
	//     }
	// }
}
