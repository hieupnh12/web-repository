package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.StaffRequest;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.mapper.StaffMapper;
import com.app.product_warehourse.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class StaffService {
    StaffMapper staffMapper;
    StaffRepository staffRepository;

    public StaffResponse createStaff(StaffRequest request) {
        Staff staff = staffMapper.toStaff(request);
        var savedStaff = staffRepository.save(staff);
      return  staffMapper.toStaffResponse(savedStaff);

    }

    public void deleteStaff(String userId) {
        staffRepository.deleteById(userId);
    }
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(staffMapper::toStaffResponse)
                .collect(Collectors.toList());
    }

}
