package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.response.AccountResponse;
import com.app.product_warehourse.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountResponse accountToAccountResponse(Account account,Long roleId);
}
