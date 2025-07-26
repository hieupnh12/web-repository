package com.app.product_warehourse.dto.request;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ImportReceiptDetailsRequest {

    String import_id;

    String productVersionId;

    @Min(value = 0, message = "Số lượng phải không âm")
    Integer quantity;

    @Min(value = 0, message = "Số lượng phải không âm")
    Integer unitPrice;

    Boolean type;

    List<ProductItemRequest> imei;   //importRequest3

}
