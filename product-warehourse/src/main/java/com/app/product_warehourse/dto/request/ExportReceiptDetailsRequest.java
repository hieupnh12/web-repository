package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ExportReceiptDetail;
import com.app.product_warehourse.entity.ProductItem;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ExportReceiptDetailsRequest {


    String export_id;
    String productVersionId; // Đổi tên từ productVersionId thành itemId để rõ ràng
    @Min(value = 0, message = "Số lượng phải không âm")
    Integer quantity;
    @Min(value = 0, message = "Số lượng phải không âm")
    Integer unitPrice;

    List<ProductItemRequest> imei;   //importRequest3
}
