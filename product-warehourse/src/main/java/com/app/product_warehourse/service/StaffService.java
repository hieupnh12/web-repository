package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.StaffCreateRequest;
import com.app.product_warehourse.dto.request.StaffUpdateRequest;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.StaffMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class StaffService {
    AccountRepository accountRepository;
    StaffMapper staffMapper;
    StaffRepository staffRepository;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Staff_CREATE')")
    public StaffResponse createStaff(StaffCreateRequest request) {
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXITED);
        }
        Staff staff = staffMapper.toStaff(request);
        var savedStaff = staffRepository.save(staff);
      return  staffMapper.toStaffResponse(savedStaff);

    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Staff_DELETE')")
    public void deleteStaff(String userId) {
        staffRepository.deleteById(userId);
    }


    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Staff_VIEW')")
    @Cacheable("staffs")
    public List<StaffResponse> getAllStaff() {
        List<StaffResponse> result = staffRepository.findAllStaffResponse();
        return result;
    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Staff_UPDATE')")
    public StaffResponse updateStaff(String staffId, StaffUpdateRequest request) {
        var staff = staffRepository.findById(staffId).orElseThrow(() ->
                new AppException(ErrorCode.STAFF_NOT_EXIST));
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXITED);
        }
            staffMapper.updateStaff(staff, request);
            return staffMapper.toStaffResponse(staffRepository.save(staff));
    }


    public StaffResponse getMyInfo() {
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        var staff = staffRepository.findById(account.getStaffId()).orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_EXIST));
        return staffMapper.toStaffResponse(staff);
    }




}
