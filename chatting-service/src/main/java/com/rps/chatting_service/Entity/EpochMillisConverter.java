package com.rps.chatting_service.Entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Converter(autoApply = false)
public class EpochMillisConverter implements AttributeConverter<LocalDateTime, Long> {
    @Override
    public Long convertToDatabaseColumn(LocalDateTime attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    @Override
    public LocalDateTime convertToEntityAttribute(Long dbData) {
        if (dbData == null) {
            return null;
        }
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(dbData), ZoneOffset.UTC);
    }
}
