package com.app.product_warehourse.exception;


import com.app.product_warehourse.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse> runtimeExceptionHandler(RuntimeException e) {
//        ApiResponse apiResponse = new ApiResponse();
//        apiResponse.setCode(1001);
//        apiResponse.setMessage(e.getMessage());
//        return ResponseEntity.badRequest().body(apiResponse);
//    }






      @ExceptionHandler(value = RuntimeException.class)
      ResponseEntity<ApiResponse> runtimeExceptionHandler(RuntimeException e) {
          ApiResponse apiResponse = new ApiResponse();
          apiResponse.setCode(1001);
          apiResponse.setMessage(e.getMessage());
          return ResponseEntity.badRequest().body(apiResponse);
      }


    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> AppExceptionHandler(AppException e) {
        ErrorCode errorCo = e.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCo.getCode());
        apiResponse.setMessage(errorCo.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }


//  cách sử dụng String
//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//      ResponseEntity<String> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
//          return ResponseEntity.badRequest().body(e.getFieldError().getDefaultMessage());
//      }


    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
          String enumKey = e.getBindingResult().getFieldError().getDefaultMessage();

//          ErrorCode errorCo = ErrorCode.valueOf(enumKey);

        ErrorCode errorCo = ErrorCode.INVALID_KEY;
       try {
           errorCo = ErrorCode.valueOf(enumKey);
       } catch (IllegalArgumentException ex) {

       }
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCo.getCode());
        apiResponse.setMessage(errorCo.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }






}
