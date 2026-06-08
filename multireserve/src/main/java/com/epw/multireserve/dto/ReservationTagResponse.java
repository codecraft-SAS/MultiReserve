package com.epw.multireserve.dto;

import java.util.ArrayList;
import java.util.List;

public class ReservationTagResponse {

    private Long reservationId;

    private String customerName;

    private List<TagResponse> tags = new ArrayList<>();

    public Long getReservationId() {
        return reservationId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public List<TagResponse> getTags() {
        return tags;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setTags(List<TagResponse> tags) {
        this.tags = tags;
    }
}