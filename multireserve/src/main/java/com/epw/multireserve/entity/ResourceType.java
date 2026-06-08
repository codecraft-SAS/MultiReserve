package com.epw.multireserve.entity;

public enum ResourceType {

    COURT("Cancha"),
    ROOM("Sala"),
    CABIN("Cabaña"),
    TABLE("Mesa");

    private final String label;

    ResourceType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}