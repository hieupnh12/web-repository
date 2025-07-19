package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.PermissionRequest;
import com.app.product_warehourse.dto.response.PermissionResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Functions;
import com.app.product_warehourse.entity.Permission;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.PermissionMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.FunctionRepository;
import com.app.product_warehourse.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {
    FunctionRepository functionRepository;
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    AccountRepository accountRepository;

    public PermissionResponse createPermission(PermissionRequest request) {
        Functions functions = functionRepository.findById(request.getFunctionId())
                .orElseThrow(() -> new RuntimeException("Functions not found"));
            Permission permission = new Permission();
            permission.setFunctions(functions);
            permission.setCanView(request.isCanView());
            permission.setCanCreate(request.isCanCreate());
            permission.setCanUpdate(request.isCanUpdate());
            permission.setCanDelete(request.isCanDelete());

            var pms = permissionRepository.save(permission);
        //return permissionMapper.toPermissionResponse(pms,functions.getFunctionId());
        return permissionMapper.toPermissionResponse(pms);
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .collect(Collectors.toList());
    }
    public List<PermissionResponse> getPermissionByFunctionId(Long functionId) {
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        return permissionRepository.getPermissionsByFunctionId(account.getStaffId(), functionId);
    }

}
