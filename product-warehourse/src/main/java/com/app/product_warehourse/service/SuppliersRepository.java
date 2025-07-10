package com.app.product_warehourse.service;

import com.app.product_warehourse.entity.Suppliers;
import org.springframework.data.repository.Repository;

interface SuppliersRepository extends Repository<Suppliers, String> {
    Suppliers findById(String id);
}
