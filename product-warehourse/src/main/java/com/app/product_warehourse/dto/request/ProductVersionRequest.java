package com.app.product_warehourse.dto.request;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
// Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductVersionRequest {

    @NotNull
    @Positive
    Long productId;

    @NotNull
    @Positive
    Long romId;

    @NotNull
    @Positive
    Long ramId;

    @NotNull
    @Positive
    Long colorId;

    @NotNull
    @DecimalMin("0.0")
    BigDecimal importPrice;

    @NotNull
    @DecimalMin("0.0")
    BigDecimal exportPrice;

    @NotNull
    Boolean status;

}
