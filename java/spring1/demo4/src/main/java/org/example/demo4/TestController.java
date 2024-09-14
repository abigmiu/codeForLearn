package org.example.demo4;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/json")
public class TestController {

    @RequestMapping("/user")
    public Student getStudent() {
        return new Student(1, "2", "3");
    }
}
