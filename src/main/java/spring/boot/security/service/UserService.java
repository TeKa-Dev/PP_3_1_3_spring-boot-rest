package spring.boot.security.service;

import spring.boot.security.entity.Role;
import spring.boot.security.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAllUsers();
    User findUserById(Long id);
    User findByUsername(String username);
    void deleteUser(Long id);
    void saveUser(User user);
    List<Role> findAllRoles();
    List<Role> findRoles(List<Long> rolesId);
    void saveRole(Role role);
}
