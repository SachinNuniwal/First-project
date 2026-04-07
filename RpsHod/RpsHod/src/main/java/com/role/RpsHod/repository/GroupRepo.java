package com.role.RpsHod.repository;


import com.role.RpsHod.entity.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepo extends JpaRepository<ChatGroup, Long> {
}
