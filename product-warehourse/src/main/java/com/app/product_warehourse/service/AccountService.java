package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.AccountCreateRequest;
import com.app.product_warehourse.dto.request.ChangePasswordRequest;
import com.app.product_warehourse.dto.response.AccountResponse;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.AccountMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.RoleRepository;
import com.app.product_warehourse.repository.StaffRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class AccountService {
    AccountMapper accountMapper;
    AccountRepository accountRepository;
    StaffRepository staffRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public AccountResponse createAccount(AccountCreateRequest request, String staffId) {
        // Kiểm tra Staff tồn tại
        try {
            Staff staff = staffRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Staff not found with id: " + staffId));
            if (accountRepository.existsByUserName(request.getUserName())) {
                throw new AppException(ErrorCode.ACCOUNT_EXITED);
            }
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found with id: " + request.getRoleId()));

//            Account account = Account.builder()
//                    .staffId(staffId)
//                    .userName(request.getUserName())
//                    .password(passwordEncoder.encode(request.getPassword()))
//                    .role(role)
//                    .status(1)
//                    .otp(null)
//                    .build();
            Account account = new Account();
            account.setStaff(staff);
            account.setUserName(request.getUserName());
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            account.setRole(role);

            var ac = accountRepository.save(account);
            return accountMapper.accountToAccountResponse(ac,role.getRoleId());

        } catch (Exception e) {
            log.error("Error creating account", e);  // <- thêm dòng log này
            throw e;
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(account -> accountMapper.accountToAccountResponse(account,account.getRole().getRoleId()))
                .collect(Collectors.toList());
    }

    public void changePassword(ChangePasswordRequest request,String staffId) {

        var account = accountRepository.findById(staffId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        boolean checkOldPassword = passwordEncoder.matches(request.getOldPassword(), account.getPassword());
        if (checkOldPassword) {
            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepository.save(account);
        } else {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
    }


}
