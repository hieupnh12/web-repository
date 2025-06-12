package com.app.product_warehourse.exception;

import com.app.product_warehourse.dto.request.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.app.product_warehourse.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.access.AccessDeniedException;



@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZE_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZE_EXCEPTION.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
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
    ResponseEntity<ApiResponse> handlingRuntimeException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
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
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);

        apiResponse.setCode(errorCo.getCode());
        apiResponse.setMessage(errorCo.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDenidedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }


}
