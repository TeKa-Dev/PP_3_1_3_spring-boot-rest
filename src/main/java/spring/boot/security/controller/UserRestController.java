package spring.boot.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import spring.boot.security.entity.User;
import spring.boot.security.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        return userService.findByUsername(principal.getName());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping
    public User saveUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping
    public void deleteUser(@RequestBody User user) {
        userService.deleteUser(user);
    }
}
