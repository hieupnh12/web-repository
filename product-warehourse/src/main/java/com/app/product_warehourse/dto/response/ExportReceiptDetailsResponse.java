package com.app.product_warehourse.dto.response;


import com.app.product_warehourse.dto.request.ProductItemRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ExportReceiptDetailsResponse {

    String export_id;
    String productVersionId;
    Integer quantity;
    Integer unitPrice;


    List<ImeiResponse> imei;   //importRequest3

}
