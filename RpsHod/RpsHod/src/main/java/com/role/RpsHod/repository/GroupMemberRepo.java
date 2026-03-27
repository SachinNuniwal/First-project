package com.role.RpsHod.repository;

import com.role.RpsHod.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMemberRepo extends JpaRepository<GroupMember,Long> {
    List<GroupMember> findByUserId(String userId);
}
