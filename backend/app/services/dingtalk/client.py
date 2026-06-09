"""钉钉 API 客户端"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import time
import urllib.parse
from typing import Any

import httpx

logger = logging.getLogger(__name__)

DINGTALK_OAPI = "https://oapi.dingtalk.com"
DINGTALK_API = "https://api.dingtalk.com"


class DingtalkApiError(Exception):
    def __init__(self, code: int | str, msg: str):
        self.code = code
        self.msg = msg
        super().__init__(f"Dingtalk API {code}: {msg}")


def _check_oapi(data: dict) -> None:
    errcode = int(data.get("errcode") or 0)
    if errcode != 0:
        raise DingtalkApiError(errcode, str(data.get("errmsg") or "unknown error"))


def get_access_token(app_key: str, app_secret: str) -> str:
    url = f"{DINGTALK_OAPI}/gettoken"
    with httpx.Client(timeout=15.0) as client:
        resp = client.get(url, params={"appkey": app_key, "appsecret": app_secret})
        resp.raise_for_status()
        data = resp.json()
    _check_oapi(data)
    token = data.get("access_token")
    if not token:
        raise DingtalkApiError(-1, "empty access_token")
    return str(token)


def parse_agent_id(agent_id: str | int | None) -> int:
    try:
        val = int(str(agent_id or "").strip())
    except (TypeError, ValueError):
        raise DingtalkApiError(-1, "请先配置 AgentId") from None
    if val <= 0:
        raise DingtalkApiError(-1, "请先配置 AgentId")
    return val


def _signed_webhook_url(webhook_url: str, secret: str) -> str:
    if not secret.strip():
        return webhook_url.strip()
    timestamp = str(int(time.time() * 1000))
    string_to_sign = f"{timestamp}\n{secret.strip()}"
    hmac_code = hmac.new(secret.strip().encode("utf-8"), string_to_sign.encode("utf-8"), digestmod=hashlib.sha256).digest()
    sign = urllib.parse.quote_plus(base64.b64encode(hmac_code))
    sep = "&" if "?" in webhook_url else "?"
    return f"{webhook_url.strip()}{sep}timestamp={timestamp}&sign={sign}"


def send_webhook_message(webhook_url: str, payload: dict, *, secret: str = "") -> None:
    url = _signed_webhook_url(webhook_url, secret)
    if not url:
        raise DingtalkApiError(-1, "webhook_url empty")
    with httpx.Client(timeout=20.0) as client:
        resp = client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
    _check_oapi(data)


def send_webhook_text(webhook_url: str, content: str, *, secret: str = "") -> None:
    send_webhook_message(
        webhook_url,
        {"msgtype": "text", "text": {"content": content[:4000]}},
        secret=secret,
    )


def send_webhook_action_card(webhook_url: str, card: dict[str, Any], *, secret: str = "") -> None:
    send_webhook_message(webhook_url, {"msgtype": "actionCard", "actionCard": card}, secret=secret)


def send_work_notification(
    access_token: str,
    *,
    agent_id: str | int,
    userid: str,
    msg: dict[str, Any],
) -> str:
    url = f"{DINGTALK_OAPI}/topapi/message/corpconversation/asyncsend_v2?access_token={access_token}"
    payload = {
        "agent_id": parse_agent_id(agent_id),
        "userid_list": userid,
        "to_all_user": False,
        "msg": msg,
    }
    with httpx.Client(timeout=20.0) as client:
        resp = client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
    _check_oapi(data)
    return str(data.get("task_id") or "")


def get_userid_by_mobile(access_token: str, mobile: str) -> str | None:
    url = f"{DINGTALK_OAPI}/topapi/v2/user/getbymobile?access_token={access_token}"
    with httpx.Client(timeout=15.0) as client:
        resp = client.post(url, json={"mobile": mobile})
        resp.raise_for_status()
        data = resp.json()
    if int(data.get("errcode") or 0) != 0:
        return None
    result = data.get("result") or {}
    userid = result.get("userid")
    return str(userid).strip() if userid else None


def batch_get_userid_by_mobiles(access_token: str, mobiles: list[str]) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for mobile in mobiles[:100]:
        uid = get_userid_by_mobile(access_token, mobile)
        results.append({"mobile": mobile, "userid": uid or ""})
    return results


def get_userid_by_unionid(access_token: str, unionid: str) -> str | None:
    url = f"{DINGTALK_OAPI}/topapi/user/getbyunionid?access_token={access_token}"
    with httpx.Client(timeout=15.0) as client:
        resp = client.post(url, json={"unionid": unionid})
        resp.raise_for_status()
        data = resp.json()
    if int(data.get("errcode") or 0) != 0:
        return None
    result = data.get("result") or {}
    userid = result.get("userid")
    return str(userid).strip() if userid else None


def list_departments(access_token: str, dept_id: int = 1) -> list[dict[str, Any]]:
    url = f"{DINGTALK_OAPI}/topapi/v2/department/listsub?access_token={access_token}"
    with httpx.Client(timeout=20.0) as client:
        resp = client.post(url, json={"dept_id": dept_id})
        resp.raise_for_status()
        data = resp.json()
    _check_oapi(data)
    items: list[dict[str, Any]] = []
    for d in data.get("result") or []:
        items.append({
            "dept_id": d.get("dept_id"),
            "name": d.get("name"),
            "parent_id": d.get("parent_id"),
        })
    return items


def get_oauth_authorize_url(app_key: str, redirect_uri: str, state: str) -> str:
    params = urllib.parse.urlencode({
        "client_id": app_key,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid",
        "state": state,
        "prompt": "consent",
    })
    return f"https://login.dingtalk.com/oauth2/auth?{params}"


def exchange_user_access_token(app_key: str, app_secret: str, code: str) -> dict[str, Any]:
    url = f"{DINGTALK_API}/v1.0/oauth2/userAccessToken"
    payload = {
        "clientId": app_key,
        "clientSecret": app_secret,
        "code": code,
        "grantType": "authorization_code",
    }
    with httpx.Client(timeout=15.0) as client:
        resp = client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
    if not data.get("accessToken"):
        raise DingtalkApiError(-1, json.dumps(data, ensure_ascii=False)[:200])
    return data


def get_user_me(user_access_token: str) -> dict[str, Any]:
    url = f"{DINGTALK_API}/v1.0/contact/users/me"
    with httpx.Client(timeout=15.0) as client:
        resp = client.get(url, headers={"x-acs-dingtalk-access-token": user_access_token})
        resp.raise_for_status()
        return resp.json()
