from datetime import datetime

from pydantic import BaseModel, Field


class AiEmployeeCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    avatar_url: str | None = None
    role_desc: str | None = Field(default=None, max_length=200)
    system_prompt: str = Field(min_length=1, max_length=8000)
    status: str = Field(default="active", max_length=20)
    bindchannels: list[str] | None = None
    knowledge_scopes: list[str] | None = None
    enabled_tools: list[str] | None = None
    gateway_override: str | None = Field(default=None, max_length=64)
    welcome_message: str | None = Field(default=None, max_length=500)


class AiEmployeeUpdateIn(BaseModel):
    name: str | None = Field(default=None, max_length=50)
    avatar_url: str | None = None
    role_desc: str | None = None
    system_prompt: str | None = None
    status: str | None = None
    bindchannels: list[str] | None = None
    knowledge_scopes: list[str] | None = None
    enabled_tools: list[str] | None = None
    gateway_override: str | None = None
    welcome_message: str | None = None


class AiEmployeeResponse(BaseModel):
    id: int
    tenant_id: int
    name: str
    avatar_url: str | None = None
    role_desc: str | None = None
    system_prompt: str
    status: str
    bindchannels: list[str] | None = None
    knowledge_scopes: list[str] | None = None
    enabled_tools: list[str] | None = None
    gateway_override: str | None = None
    welcome_message: str | None = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class AiEmployeeChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    conversation_id: int | None = None
    model_code: str | None = Field(default=None, max_length=64)


class AiEmployeeChatResponse(BaseModel):
    conversation_id: int
    reply: str
    tool_calls_used: list[str] | None = None
    tokens_in: int | None = None
    tokens_out: int | None = None


class AiEmployeeConversationResponse(BaseModel):
    id: int
    ai_employee_id: int
    channel: str
    user_id: int | None = None
    external_user_id: str | None = None
    external_user_name: str | None = None
    title: str | None = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class AiEmployeeMessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    tool_calls: dict | None = None
    tokens_in: int | None = None
    tokens_out: int | None = None
    created_at: datetime
    model_config = {"from_attributes": True}


class AiEmployeeLogResponse(BaseModel):
    id: int
    ai_employee_id: int
    action: str
    channel: str | None = None
    detail: dict | None = None
    tokens_used: int | None = None
    created_at: datetime
    model_config = {"from_attributes": True}


class AiEmployeeStatsResponse(BaseModel):
    total_conversations: int
    total_messages: int
    total_tokens: int
    today_conversations: int
    today_messages: int
    tool_call_count: int


class AvailableToolResponse(BaseModel):
    code: str
    description: str
    parameters: dict | None = None
