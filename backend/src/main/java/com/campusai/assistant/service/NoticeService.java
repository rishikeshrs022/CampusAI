package com.campusai.assistant.service;

import com.campusai.assistant.entity.Notice;
import com.campusai.assistant.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public Optional<Notice> getNoticeById(String id) {
        return noticeRepository.findById(id);
    }

    public Notice saveNotice(Notice notice) {
        if (notice.getSummary() == null || notice.getSummary().trim().isEmpty()) {
            String content = notice.getContent();
            if (content.length() > 120) {
                notice.setSummary(content.substring(0, 117) + "...");
            } else {
                notice.setSummary(content);
            }
        }
        return noticeRepository.save(notice);
    }

    public void deleteNotice(String id) {
        noticeRepository.deleteById(id);
    }
}
