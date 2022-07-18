package spring.boot.security.test.users;

import spring.boot.security.entity.Role;
import spring.boot.security.entity.User;
import spring.boot.security.service.UserService;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.util.Collection;

@Component
public class TestUser {

    private final UserService userService;

        public TestUser(UserService userService) {
            this.userService = userService;
        }

        @PostConstruct
        private void initialize() {
            Role roleAdmin = new Role();
            Role roleUser = new Role();
            roleAdmin.setName("ADMIN");
            roleUser.setName("USER");
            userService.saveRole(roleAdmin);
            userService.saveRole(roleUser);

            User admin = new User();
            admin.setUsername("a");
            admin.setLastname("Adminov");
            admin.setAge(11);
            admin.setEmail("admin@mail.com");
            admin.setPassword("a");
            Collection<Role> adminRoles = admin.getRoles();
            adminRoles.add(roleAdmin);
            adminRoles.add(roleUser);

            User user = new User();
            user.setPassword("u");
            user.setLastname("Userov");
            user.setAge(22);
            user.setEmail("user@mail.com");
            user.setUsername("u");
            Collection<Role> userRoles = user.getRoles();
            userRoles.add(roleUser);

            userService.saveUser(admin);
            userService.saveUser(user);
        }
    }

