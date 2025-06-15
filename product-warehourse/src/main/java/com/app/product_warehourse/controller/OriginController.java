package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.OriginRequest;
import com.app.product_warehourse.dto.response.OriginResponse;
import com.app.product_warehourse.entity.Origin;
import com.app.product_warehourse.service.OriginService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/origin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OriginController {

    OriginService originService;

    @PostMapping
    public Origin createOrigin(@RequestBody OriginRequest request) {
        return originService.createOrigin(request);
    }

    @GetMapping
    public List<OriginResponse> getAllOrigins() {
        return originService.getAllOrigins();
    }

    @GetMapping("/{id}")
    public Origin getOriginById(@PathVariable Long id) {
        return originService.getOriginById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteOrigin(@PathVariable Long id) {
        originService.deleteOriginById(id);
        System.out.println("Successfully deleted origin");
    }

    @PutMapping("/{id}")
    public OriginResponse updateOrigin(@PathVariable Long id, @RequestBody OriginRequest request) {
        return originService.updateOrigin(id, request);
    }
}
