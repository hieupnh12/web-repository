package com.app.product_warehourse.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductItemRequest {

    @Pattern(regexp = "^\\d{15}$", message = "IMEI must be exactly 15 digits")
    String imei;

    String productVersionId;

    String importId;

    String exportId;

    @Builder.Default
    boolean status = false; // Default status set to false (equivalent to 0)
}
