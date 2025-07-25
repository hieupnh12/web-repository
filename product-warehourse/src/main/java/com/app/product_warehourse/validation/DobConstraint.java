package com.app.product_warehourse.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(
        validatedBy = {DobValidator.class}
)
public @interface DobConstraint {

    String message() default "Invalid date of birth";

    int min();
    int max() default Integer.MAX_VALUE;
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
