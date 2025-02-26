package com.scott.chat.util;

import org.springframework.context.ApplicationEvent;

public class MessageFileUpdatedEvent extends ApplicationEvent {
	private final Integer supermessagelogid;

    public MessageFileUpdatedEvent(Object source, Integer supermessagelogid) {
        super(source);
        this.supermessagelogid = supermessagelogid;
    }
    
    public Integer getsupermessagelogid() {
        return supermessagelogid;
    }
    
}
