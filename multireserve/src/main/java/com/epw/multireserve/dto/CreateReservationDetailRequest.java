package com.epw.multireserve.dto;

public class CreateReservationDetailRequest {

    private String place;

    private Integer estimatedMinutes;

    private String privateNotes;

    public String getPlace() {
        return place;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public String getPrivateNotes() {
        return privateNotes;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public void setPrivateNotes(String privateNotes) {
        this.privateNotes = privateNotes;
    }
}