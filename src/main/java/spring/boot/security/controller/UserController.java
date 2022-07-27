package spring.boot.security.controller;

import spring.boot.security.entity.User;
import spring.boot.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/user")
    public String getUserInformationPage() {
        return "users_bootstrap";
    }

    @ResponseBody
    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        User currentUser = userService.findByUsername(principal.getName());
        currentUser.setPassword(null);
        return currentUser;
    }
}