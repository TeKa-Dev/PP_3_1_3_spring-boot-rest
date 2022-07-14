package spring.boot.security.controller;

import org.springframework.beans.factory.annotation.Value;
import spring.boot.security.entity.Role;
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
    public String userInfo(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute(user);
        return "info";
    }


    @GetMapping("/admin")
    public String findAll(Model model, Principal principal) {
        model.addAttribute("admin", userService.findByUsername(principal.getName()));
        model.addAttribute("userList", userService.findAllUsers());
        return "users";
    }

    @GetMapping("/admin/add")
    public String addNewUser(Model model, User user, Principal principal) {
        model.addAttribute("admin", userService.findByUsername(principal.getName()));
        model.addAttribute(user);
        model.addAttribute("roleList", userService.findAllRoles());
        return "edit";
    }

    @GetMapping("/admin/edit{id}")
    public String updateUserForm(@PathVariable Long id, Model model, Principal principal) {
        model.addAttribute("admin", userService.findByUsername(principal.getName()));
        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("roleList", userService.findAllRoles());
        return "edit";
    }

    @PostMapping("/admin/save")
    public String createUser(@RequestParam(required = false) List<Long> rolesId, User user) {
        user.setRoles(userService.findRoles(rolesId));
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/delete{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}