package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.BrandRequest;
import com.app.product_warehourse.dto.response.BrandResponse;
import com.app.product_warehourse.entity.Brand;
import com.app.product_warehourse.mapper.BrandMapper;
import com.app.product_warehourse.repository.BrandRepository;
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
@Slf4j      //để tự động tạo một logger tên log cho class Java   vd :     log.info("Bắt đầu xóa khu vực kho với ID: {}", id);;  ---> INFO  WarehouseService - Bắt đầu xóa khu vực kho với ID: abc123
public class BrandService {

       BrandRepository brandRepo;
       BrandMapper brandMapper;

        // Sử dụng cách builder
        public Brand CreateBrand(BrandRequest request) {
              Brand brand = Brand.builder()
                      .brandName(request.getBrandName())
                      .status(request.getStatus())
                      .build();

              return brandRepo.save(brand);
        }



        public List<BrandResponse> GetAllBrands() {
             List<Brand> brands = brandRepo.findAll();
              return  brands.stream()
                      .map(brandMapper ::toBrandResponse)
                      .collect(Collectors.toList());
        }


        public Brand GetBrandById(Long id) {
             return brandRepo.findById(id).orElseThrow(()-> new RuntimeException("Not Found "));
        }




//    @Transactional(readOnly = true)
//    public BrandResponse getBrandById(@NotBlank String id) {
//        log.info("Đang tìm kiếm thương hiệu với ID: {}", id);
//        Brand brand = brandRepo.findById(id)
//                .orElseThrow(() -> new BrandNotFoundException("Không tìm thấy thương hiệu với ID " + id));
//        return brandMapper.toBrandResponse(brand);
//    }



       public void DeleteBrandById(Long id) {
              brandRepo.deleteById(id);
       }



       public BrandResponse UpdateBrand(Long id ,BrandRequest request) {
             Brand brand = brandRepo.findById(id).orElse(null);
           // Update the existing brand using the mapper
           brandMapper.updateBrandFromRequest(request, brand);


           return brandMapper.toBrandResponse(brandRepo.save(brand));
       }


}
