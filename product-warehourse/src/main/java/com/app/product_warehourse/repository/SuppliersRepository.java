package com.app.product_warehourse.repository;


import com.app.product_warehourse.entity.Suppliers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuppliersRepository extends JpaRepository<Suppliers, String> {
//    Suppliers findById(String id);

    Page<Suppliers> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String name, String address, String email, String phone, Pageable pageable);

        boolean existsByPhone(String phone);

    List<Suppliers> findByStatusTrue();}
