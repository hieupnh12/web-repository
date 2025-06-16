package com.app.product_warehourse.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    WAREHOUSE_UNAVAILABLE(1016,"Warehouse area is currently unavailable, cannot add product.",HttpStatus.SERVICE_UNAVAILABLE),
    WAREHOUSE_NOT_EXIST(1013, "Warehouse Not Exist", HttpStatus.NOT_FOUND),
    WAREHOUSE_INVALID(1015,"Name must be at least 3 characters", HttpStatus.BAD_REQUEST),

    PRODUCT_NOT_EXIST(1016,"Product Not Exist", HttpStatus.NOT_FOUND),




    UNCATEGORIZE_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_EXIST(1002, "Wrong user name", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003,  "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004,  "Password  must be at least {min} characters", HttpStatus.BAD_REQUEST),
    STAFF_NOT_EXIST(1005, "Staff not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission ", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Staff birth date must be more than {min} age ", HttpStatus.BAD_REQUEST),
    NOT_FOUND_EMAIL(1009, "Can not found email ", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1010, "Invalid token", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN(1011, "Time expired", HttpStatus.UNAUTHORIZED),
    PASSWORD_NOT_MATCH(1012, "Password not match", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXIT(1013, "Role not exit", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1014, "Invalid email format", HttpStatus.BAD_REQUEST),
    PHONE_NUMBER_INVALID(1015, "Phone number must be 10 digits and start with 0", HttpStatus.BAD_REQUEST),
    FULL_NAME_NOT_BLANK(1016, "Please enter full name", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1017, "Wrong password", HttpStatus.BAD_REQUEST),
    INVALID_DATE_FORMAT(1018, "Invalid date format", HttpStatus.BAD_REQUEST),
    EMAIL_EXITED(1018, "Email already exited", HttpStatus.CONFLICT),
    ACCOUNT_EXITED(1019, "Account already exited", HttpStatus.CONFLICT),
    ROLE_EXITED(1020, "Role already exited", HttpStatus.CONFLICT),
    AUTHENTICATED_PASSWORD(1021, "Wrong password please enter against", HttpStatus.BAD_REQUEST),
    AUTHENTICATED_PASSWORD_NOT_NULL(1022, "Please enter password", HttpStatus.BAD_REQUEST),
    AUTHENTICATED_USERNAME_NOT_NULL(1023, "Please enter user name", HttpStatus.BAD_REQUEST),
    TOKEN_STILL_VALID(1024, "A valid password reset token already exists. Please check your email.",HttpStatus.BAD_REQUEST),
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