package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.response.FunctionResponse;
import com.app.product_warehourse.mapper.FunctionMapper;
import com.app.product_warehourse.repository.FunctionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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


    public List<FunctionResponse> getAllFunctions() {
        return functionRepository.findAll().stream()
                .map(functionMapper::toFunctionResponse)
                .collect(Collectors.toList());

    }

}
