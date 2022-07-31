package spring.boot.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.boot.security.entity.Role;
import spring.boot.security.entity.User;
import spring.boot.security.service.UserService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/api")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return userService.findAllRoles();
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers().stream()
                .peek(User::eraseCredentials).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("success");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestBody User user) {
        userService.deleteUser(user);
        return ResponseEntity.ok("success");
    }
}
