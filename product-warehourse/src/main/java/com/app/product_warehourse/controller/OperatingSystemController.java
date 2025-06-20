package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.OperatingSystemRequest;
import com.app.product_warehourse.dto.response.OperatingSystemResponse;
import com.app.product_warehourse.entity.OperatingSystem;
import com.app.product_warehourse.service.OperatingSystemService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operating_system")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OperatingSystemController {

    OperatingSystemService osService;

    @PostMapping
    public OperatingSystem createOS(@RequestBody @Valid OperatingSystemRequest request) {
        return osService.createOS(request);
    }

    @GetMapping
    public List<OperatingSystemResponse> getAllOS() {
        return osService.getAllOS();
    }

    @GetMapping("/{id}")
    public OperatingSystem getOSById(@PathVariable Long id) {
        return osService.getOSById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteOS(@PathVariable Long id) {
        osService.deleteOSById(id);
        System.out.println("Successfully deleted operating system");
    }

    @PutMapping("/{id}")
    public OperatingSystemResponse updateOS(@PathVariable Long id, @RequestBody OperatingSystemRequest request) {
        return osService.updateOS(id, request);
    }
}
