package spring.boot.security.controller;

import org.springframework.security.core.Authentication;
import spring.boot.security.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {

    @GetMapping("/user")
    public String getUserInformationPage() {
        return "users_bootstrap";
    }

    @ResponseBody
    @GetMapping("/current-user")
    public User getCurrentUser(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        currentUser.eraseCredentials();
        return currentUser;
    }
}