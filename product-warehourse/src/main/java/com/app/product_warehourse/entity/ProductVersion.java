package com.app.product_warehourse.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "product_version") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductVersion {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="version_id")
    String versionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="product_id")
    Product product;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="rom")
    Rom rom;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="ram")
    Ram ram;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="color")
    Color color;


    @Column(name ="import_price")
    BigDecimal importPrice;


    @Column(name ="export_price")
    BigDecimal exportPrice;

    @Column(name ="stock_quantity")
    Integer stockQuantity;


    @Column(name="status")
    Boolean status;


    @OneToMany(mappedBy = "versionId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
     List<ProductItem> productItems;


    static final Map<String, String> PRODUCT_CODE_MAPPING = new HashMap<>();

    static {
        PRODUCT_CODE_MAPPING.put("IPHONE", "IP");
        PRODUCT_CODE_MAPPING.put("SAMSUNG GALAXY", "SSG");
        PRODUCT_CODE_MAPPING.put("SONY XPERIA", "SONYX");
        PRODUCT_CODE_MAPPING.put("OPPO", "OP");
        PRODUCT_CODE_MAPPING.put("XIAOMI", "MI");
        PRODUCT_CODE_MAPPING.put("REALME", "RM");
        PRODUCT_CODE_MAPPING.put("VIVO", "VV");
        PRODUCT_CODE_MAPPING.put("NOKIA", "NK");
        PRODUCT_CODE_MAPPING.put("GOOGLE PIXEL", "GP");
        PRODUCT_CODE_MAPPING.put("ONEPLUS", "OPL");
        PRODUCT_CODE_MAPPING.put("ASUS ROG PHONE", "AROG");
        PRODUCT_CODE_MAPPING.put("ASUS ZENFONE", "AZF");
        PRODUCT_CODE_MAPPING.put("HUAWEI", "HW");
        PRODUCT_CODE_MAPPING.put("HONOR", "HN");
        PRODUCT_CODE_MAPPING.put("LENOVO", "LV");
        PRODUCT_CODE_MAPPING.put("MOTOROLA", "MOTO");
        PRODUCT_CODE_MAPPING.put("MEIZU", "MZ");
        PRODUCT_CODE_MAPPING.put("ZTE", "ZTE");
        PRODUCT_CODE_MAPPING.put("TECNO", "TC");
        PRODUCT_CODE_MAPPING.put("INFINIX", "IFX");
        PRODUCT_CODE_MAPPING.put("BLACKBERRY", "BB");
        PRODUCT_CODE_MAPPING.put("ALCATEL", "AL");
        PRODUCT_CODE_MAPPING.put("BLU", "BLU");
        PRODUCT_CODE_MAPPING.put("CATERPILLAR", "CAT");
        PRODUCT_CODE_MAPPING.put("FAIRPHONE", "FP");
        PRODUCT_CODE_MAPPING.put("MICROMAX", "MMX");
        PRODUCT_CODE_MAPPING.put("LAVA", "LAVA");
        PRODUCT_CODE_MAPPING.put("PANASONIC", "PN");
        PRODUCT_CODE_MAPPING.put("SHARP AQUOS", "SHAQ");
        PRODUCT_CODE_MAPPING.put("LEAGOO", "LGG");
        PRODUCT_CODE_MAPPING.put("ULEFONE", "ULE");
        PRODUCT_CODE_MAPPING.put("DOOGEE", "DG");
        PRODUCT_CODE_MAPPING.put("GIONEE", "GN");
        PRODUCT_CODE_MAPPING.put("ITEL", "ITL");
        PRODUCT_CODE_MAPPING.put("BQ", "BQ");
        PRODUCT_CODE_MAPPING.put("ENERGIZER", "ENZ");
        PRODUCT_CODE_MAPPING.put("VSMART", "VSM");
        PRODUCT_CODE_MAPPING.put("MOBIISTAR", "MBST");
        PRODUCT_CODE_MAPPING.put("MASSTEL", "MST");
        PRODUCT_CODE_MAPPING.put("WIKO", "WK");
        PRODUCT_CODE_MAPPING.put("THURAYA", "THR");
        PRODUCT_CODE_MAPPING.put("VERTU", "VT");

    }

    @PrePersist
    public void generateVersionId() {

        if (versionId == null) {
            String productCode = generateProductCode();
            String ramValue = ram != null ? ram.getName() : "0";
            String romValue = rom != null ? rom.getRom_size(): "0";
            String colorValue = color != null ? color.getName().toUpperCase() : "UNKNOWN";
            this.versionId = String.format("%s_%s_%s_%s", productCode, ramValue, romValue, colorValue);
        }
    }

    private String generateProductCode() {
        if (product == null || product.getProductName() == null) {
            return "UNKNOWN";
        }

        String name = product.getProductName().toUpperCase();
        // Kiểm tra ánh xạ từ khóa
        for (Map.Entry<String, String> entry : PRODUCT_CODE_MAPPING.entrySet()) {
            if (name.contains(entry.getKey())) {
                return name.replace(entry.getKey(), entry.getValue()).replaceAll("\\s+", "");
            }
        }

        // Quy tắc mặc định: Lấy ký tự đầu mỗi từ, tối đa 10 ký tự
        StringBuilder code = new StringBuilder();
        String[] words = product.getProductName().split("\\s+");
        for (String word : words) {
            if (!word.isEmpty()) {
                code.append(word.charAt(0));
            }
        }
        String result = code.toString().toUpperCase();
        return result.length() > 10 ? result.substring(0, 10) : result;
    }


}
