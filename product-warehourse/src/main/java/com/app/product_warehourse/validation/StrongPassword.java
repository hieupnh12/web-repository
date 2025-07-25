package com.app.product_warehourse.validation;

import jakarta.validation.Payload;
import jakarta.validation.Constraint;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {
    String message() default "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ in hoa, chữ thường, chữ số và ký tự đặc biệt.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
