package com.campusai.assistant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index.html"; // Spring Boot will serve this from static/ index.html
    }

    @GetMapping("/login-page")
    public String login() {
        return "index.html";
    }

    @GetMapping("/student-dashboard")
    public String dashboard() {
        return "index.html";
    }
}
