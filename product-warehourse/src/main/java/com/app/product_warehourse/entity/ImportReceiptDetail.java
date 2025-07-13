package com.app.product_warehourse.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "import_details") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ImportReceiptDetail  {

    @EmbeddedId
    ImportReceiptDetailId newid;

    @Column(name ="quantity")
    @Min(value = 0, message = "Quantity must be non-negative")
    Integer quantity;


    @Column(name ="unit_price")
    Integer unitPrice;

    @Column(name ="import_type")
    Boolean type;


    // Thêm mối quan hệ OneToMany với ProductItem
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "import_id", referencedColumnName = "import_id"),
            @JoinColumn(name = "product_version_id", referencedColumnName = "product_version_id")
    })
    List<ProductItem> productItems;



    // Định nghĩa lớp Embeddable bên trong entity
    @Embeddable
    @Data
    @NoArgsConstructor
//    @AllArgsConstructor
    public static class ImportReceiptDetailId implements Serializable {
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "import_id")
        @JsonBackReference
        ImportReceipt import_id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "product_version_id")
        ProductVersion productVersionId;

        // Constructor bổ sung
        public ImportReceiptDetailId(ImportReceipt import_id, ProductVersion productVersionId) {
            this.import_id = import_id;
            this.productVersionId = productVersionId;
        }
    }
}
