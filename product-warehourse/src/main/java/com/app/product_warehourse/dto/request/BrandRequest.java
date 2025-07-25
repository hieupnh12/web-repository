package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.entity.Brand;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.validation.UniqueName;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class BrandRequest {

    @UniqueName(entity = Brand.class, fieldName = "brandName")
    String brandName;

    Boolean  status;
}