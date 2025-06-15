package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.response.FunctionResponse;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.FunctionMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.FunctionRepository;
import com.app.product_warehourse.repository.RoleRepository;
import com.app.product_warehourse.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FunctionService {
    FunctionRepository functionRepository;
    FunctionMapper functionMapper;
    AccountRepository accountRepository;
    StaffRepository staffRepository;
    RoleRepository roleRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public List<FunctionResponse> getAllFunctions() {
        return functionRepository.findAll().stream()
                .map(functionMapper::toFunctionResponse)
                .collect(Collectors.toList());

    }

    public List<FunctionResponse> getFunctionByRole() {
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        if (name.equals("admin")) {
            return getAllFunctions();
        }
        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        var role = roleRepository.findById(account.getRole().getRoleId()).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));


        return roleRepository.findFunctionResponsesByRoleId(role.getRoleId());
    }


}
