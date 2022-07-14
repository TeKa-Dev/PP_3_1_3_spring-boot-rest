package spring.boot.security.service;

import spring.boot.security.entity.Role;
import spring.boot.security.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAllUsers();
    User findUserById(long id);
    User findByUsername(String username);
    void deleteUser(long id);
    void saveUser(User user);

    void saveRole(Role role);
    List<Role> findAllRoles();
    List<Role> findRoles(List<Long> rolesId);
}
