package com.app.product_warehourse.configuration;

import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.enums.Role;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.StaffRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;


    @Transactional
    @Bean
    ApplicationRunner applicationRunner(StaffRepository staffRepository) {
        return args -> {
            if (staffRepository.findByFullName("Admin").isEmpty()) {
                Staff staff = Staff.builder()
                        .fullName("Admin")
                        .build();

                var roles = new HashSet<String>();
                roles.add(Role.ADMIN.name());

                Account account = new Account();
                account.setStaff(staff);
                account.setUserName("admin");
                account.setPassword(passwordEncoder.encode("admin"));

                staff.setAccount(account);
                staffRepository.save(staff);

                log.warn("admin user has been created with default password: admin, change it");
            }


        };
    }
}
