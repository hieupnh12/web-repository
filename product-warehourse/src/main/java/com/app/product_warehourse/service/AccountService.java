package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.AccountCreateRequest;
import com.app.product_warehourse.dto.request.AccountUpdateRequest;
import com.app.product_warehourse.dto.request.ChangePasswordRequest;
import com.app.product_warehourse.dto.response.AccountResponse;
import com.app.product_warehourse.dto.response.StaffSelectResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.InvalidToken;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.AccountMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.InvalidTokenRepository;
import com.app.product_warehourse.repository.RoleRepository;
import com.app.product_warehourse.repository.StaffRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
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
    EmailService emailService;
    RedisTemplate<String, String> redisTemplate;
    InvalidTokenRepository invalidTokenRepository;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected Long VALID_DURATION;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Account_CREATE')")
    @Transactional
    public void createAccount(AccountCreateRequest request, String staffId) {

        try {
            Staff staff = staffRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Staff not found with id: " + staffId));
            if (accountRepository.existsByUserName(request.getUserName())) {
                throw new AppException(ErrorCode.ACCOUNT_EXITED);
            }

            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found with id: " + request.getRoleId()));

            Account account = new Account();
            account.setStaff(staff);
            account.setUserName(request.getUserName());
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            account.setRole(role);

            var ac = accountRepository.save(account);
            emailService.sendUserNamePassword(staff.getEmail(),request.getUserName(),request.getPassword());



        } catch (Exception e) {
            log.error("Error creating account", e);  // <- thêm dòng log này
            throw e;
        }
    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Account_VIEW')")
    @Cacheable("account")
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(account -> accountMapper.accountToAccountResponse(account,account.getRole().getRoleId(), account.getRole().getRoleName()))
                .collect(Collectors.toList());
    }

    public void changePassword(ChangePasswordRequest request,String staffId) {

        var account = accountRepository.findById(staffId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        boolean checkOldPassword = passwordEncoder.matches(request.getOldPassword(), account.getPassword());
        if (!checkOldPassword) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepository.save(account);
        String jwtId = redisTemplate.opsForValue().get("jwt:" + account.getUserName());
        if (jwtId != null) {
            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jwtId)
                    .expiryTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                    .build();
            invalidTokenRepository.save(invalidToken);
            redisTemplate.delete("jwt:" + account.getUserName());
            redisTemplate.delete("permissions:" + account.getUserName());

        }
    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Account_UPDATE')")
        public AccountResponse updateAccount(String staffId, AccountUpdateRequest request) {
        var account = accountRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
                account.setStatus(request.getStatus());
                account.setRole(roleRepository.findById(request.getRoleId()).orElseThrow(()-> new AppException(ErrorCode.ROLE_NOT_EXIT)));
                accountRepository.save(account);

        String jwtId = redisTemplate.opsForValue().get("jwt:" + account.getUserName());
        if (jwtId != null) {
            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jwtId)
                    .expiryTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                    .build();
            invalidTokenRepository.save(invalidToken);
            redisTemplate.delete("jwt:" + account.getUserName());
            redisTemplate.delete("permissions:" + account.getUserName());
        }


                return accountMapper.accountToAccountResponse(account,account.getRole().getRoleId(),account.getRole().getRoleName());
        }


    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public Account getAccountEntity(String staffId) {
        return accountRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
    }

    public List<StaffSelectResponse> getStaff() {
        return accountRepository.getStaff();
    }

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Account_DELETE')")
    public void deleteAccountByStaffId(String staffId) {
        staffRepository.deleteById(staffId);
    }

}
