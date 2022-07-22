package spring.boot.security.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import spring.boot.security.entity.Role;
import spring.boot.security.entity.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> findAllUsers();
    User findUserById(Long id);
    User findByUsername(String username);
    void deleteUser(Long id);
    void deleteUser(User user);
    void saveUser(User user);
    List<Role> findAllRoles();
    List<Role> findRoles(List<Long> rolesId);
    void saveRole(Role role);
}
