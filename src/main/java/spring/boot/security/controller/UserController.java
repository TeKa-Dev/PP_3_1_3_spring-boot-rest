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

    @ResponseBody
    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        User currentUser = userService.findByUsername(principal.getName());
        currentUser.setPassword(null);
        return currentUser;
    }

    @GetMapping("/user")
    public String getUserInformationPage(Model model, Principal principal) {
        model.addAttribute("currentUser", userService.findByUsername(principal.getName()));
        model.addAttribute("roleList", userService.findAllRoles());
        model.addAttribute(new User());
        return "users_bootstrap";
    }

    @GetMapping("/admin")
    public String getAdminPanel(Model model, Principal principal) {
        model.addAttribute("userList", userService.findAllUsers());
        model.addAttribute("adminPanel", true);
        return getUserInformationPage(model, principal);
    }

    @PostMapping("/admin/save")
    public String saveUser(@RequestParam List<Long> roleIds, User user) {
        user.setRoles(userService.findRoles(roleIds));
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/admin/delete")
    public String deleteUser(User user) {
        userService.deleteUser(user.getId());
        return "redirect:/admin";
    }
}