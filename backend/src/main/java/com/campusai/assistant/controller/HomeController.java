package com.campusai.assistant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping({"/", "/login", "/admin/dashboard", "/student/dashboard"})
    public String index() {
        return "forward:/index.html";
    }
}
