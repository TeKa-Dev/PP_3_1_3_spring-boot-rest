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
    public String getUserInformationPage(Model model, Principal principal) {
        model.addAttribute("currentUser", userService.findByUsername(principal.getName()));
        return "users";
    }

    @GetMapping("/admin")
    public String getAdminPanel(Model model, Principal principal) {
        model.addAttribute("userList", userService.findAllUsers());
        model.addAttribute("adminPanel", true);
        return getUserInformationPage(model, principal);
    }

    @GetMapping("/admin/add")
    public String getUserCreatePage(Model model, User user, Principal principal) {
        model.addAttribute("currentUser", userService.findByUsername(principal.getName()));
        model.addAttribute("roleList", userService.findAllRoles());
        model.addAttribute("isNewUser", user.getId() == null);
        model.addAttribute(user);
        return "edit";
    }

    @GetMapping("/admin/edit{id}")
    public String getUserEditPage(@PathVariable Long id, Model model, Principal principal) {
        return getUserCreatePage(model, userService.findUserById(id), principal);
    }

    @PostMapping("/admin/save")
    public String saveUser(@RequestParam List<Long> roleIds, Model model, User user, Principal principal) {
        if (user.getId() == null && userService.findAllUsers().contains(user)) {
            model.addAttribute("isUsernameExists", true);
            return getAdminPanel(model, principal);
        }
        user.setRoles(userService.findRoles(roleIds));
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/delete{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}