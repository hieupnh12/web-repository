package com.app.product_warehourse.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    UNCATEGORIZE_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_EXIST(1002, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003,  "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004,  "Password  must be at least {min} characters", HttpStatus.BAD_REQUEST),
    STAFF_NOT_EXIST(1005, "Staff not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission ", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Invalid date of birth {min} ", HttpStatus.BAD_REQUEST),
    NOT_FOUND_EMAIL(1009, "Can not found email ", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1010, "Invalid token", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN(1011, "Time expired", HttpStatus.UNAUTHORIZED),
    PASSWORD_NOT_MATCH(1012, "Password not match", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXIT(1013, "Role not exit", HttpStatus.BAD_REQUEST),
    ;

    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;


}