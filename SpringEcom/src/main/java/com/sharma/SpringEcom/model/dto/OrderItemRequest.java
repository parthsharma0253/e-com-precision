package com.sharma.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
