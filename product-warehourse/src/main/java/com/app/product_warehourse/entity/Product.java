package com.app.product_warehourse.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "product") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", length = 255)
    private Long productId;

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "image", length = 255)
    private String image;

        @ManyToOne
        @JoinColumn(name = "origin") // 👈 ánh xạ cột origin (kiểu String chứa ID)
        private Origin origin;

    @Column(name = "processor", length = 255)
    private String processor;

    @Column(name = "battery")
    private Integer battery;

    @Column(name = "screen_size")
    private Double screenSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operating_system")
    private OperatingSystem operatingSystem;

    @Column(name = "chipset")
    private Integer chipset;

    @Column(name = "rear_camera", length = 255)
    private String rearCamera;

    @Column(name = "front_camera", length = 255)
    private String frontCamera;

    @Column(name = "warranty_period")
    private Integer warrantyPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_area")
    private WarehouseArea warehouseArea;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "status")
    private Boolean status;
}
