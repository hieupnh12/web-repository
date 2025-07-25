package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "export_details") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ExportReceiptDetail {


    // Định nghĩa lớp Embeddable bên trong entity
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExportReceiptDetailId implements Serializable {
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name ="export_id")
        ExportReceipt export_id;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name ="product_version_id")
        ProductItem productVersionId;
    }

    @EmbeddedId
    ExportReceiptDetail.ExportReceiptDetailId newExId;

    @Column(name ="quantity")
    @Min(value = 0, message = "Quantity must be non-negative")
    Integer quantity;


    @Column(name ="unit_price")
    Integer unitPrice;


    // Thêm mối quan hệ OneToMany với ProductItem
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "export_id", referencedColumnName = "export_id"),
            @JoinColumn(name = "imei", referencedColumnName = "product_version_id")
    })
    List<ProductItem> productItems;


}
