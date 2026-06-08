package com.epw.multireserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.CreateTagRequest;
import com.epw.multireserve.dto.TagResponse;
import com.epw.multireserve.entity.Tag;
import com.epw.multireserve.repository.TagRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagRepository repository;

    public TagController(TagRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TagResponse> list() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponse create(
            @Valid @RequestBody CreateTagRequest request) {

        Tag tag = new Tag();

        tag.setName(request.getName());

        Tag saved = repository.save(tag);

        return toResponse(saved);
    }

    private TagResponse toResponse(
            Tag tag) {

        TagResponse response = new TagResponse();

        response.setId(tag.getId());
        response.setName(tag.getName());

        return response;
    }
}