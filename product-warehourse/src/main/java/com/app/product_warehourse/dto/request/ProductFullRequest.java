package com.app.product_warehourse.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFullRequest {

    Long productId;

    ProductsRequest products ;

    //them danh sach cac phien ban san pham
     List<ProductVersionRequest> versions;
}
