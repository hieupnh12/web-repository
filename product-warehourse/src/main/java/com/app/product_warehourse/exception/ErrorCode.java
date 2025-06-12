package com.app.product_warehourse.exception;

import lombok.*;
import lombok.experimental.FieldDefaults;



@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    WAREHOUSE_NOT_EXIST(1002, "Warehouse Not Exist"),
    WAREHOUSE_INVALID(1010,"name must be at least 3 characters"),
    INVALID_KEY(9999,"invalid key error code"),
    ;

    int code ;
    String message;


    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }



    public int getCode() {
        return code;
    }


}
