from datetime import time

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_permissions
from app.core.response import ok
from app.crud.shift import (
    batch_create_shift_schedules,
    create_shift,
    create_shift_schedule,
    delete_shift,
    delete_shift_schedule,
    get_shift_by_code,
    get_shift_by_id,
    get_shift_schedule_by_id,
    list_shift_schedules,
    list_shifts,
    update_shift,
)
from app.models.user import User
from app.schemas.shift import (
    ShiftCreateIn,
    ShiftScheduleBatchCreateIn,
    ShiftScheduleCreateIn,
    ShiftUpdateIn,
)
from app.services.code_generator import BizType, resolve_code


def _shift_code_exists(db: Session, tenant_id: int, code: str) -> bool:
    return get_shift_by_code(db, tenant_id, code) is not None


router = APIRouter(dependencies=[Depends(require_permissions(["attendance.manage"]))])


# ==================== 班次 ====================

@router.get("")
def list_shifts_api(
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items = list_shifts(db, user.tenant_id, status=status)
    return ok({"items": [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "start_time": s.start_time.strftime("%H:%M"),
            "end_time": s.end_time.strftime("%H:%M"),
            "rest_minutes": s.rest_minutes,
            "shift_type": s.shift_type,
            "status": s.status,
            "remark": s.remark,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        }
        for s in items
    ]})


@router.post("")
def create_shift_api(
    payload: ShiftCreateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shift_code = resolve_code(
        db,
        tenant_id=user.tenant_id,
        biz_type=BizType.EQUIPMENT,
        code=payload.code,
        exists=lambda c: _shift_code_exists(db, user.tenant_id, c),
        duplicate_msg="班次编码已存在",
    )
    start_t = time.fromisoformat(payload.start_time)
    end_t = time.fromisoformat(payload.end_time)
    s = create_shift(
        db,
        tenant_id=user.tenant_id,
        code=shift_code,
        name=payload.name,
        start_time=start_t,
        end_time=end_t,
        rest_minutes=payload.rest_minutes,
        shift_type=payload.shift_type,
        remark=payload.remark,
    )
    db.commit()
    return ok({"id": s.id, "code": s.code, "name": s.name})


@router.put("/{shift_id}")
def update_shift_api(
    shift_id: int,
    payload: ShiftUpdateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = get_shift_by_id(db, user.tenant_id, shift_id)
    if not s:
        raise HTTPException(status_code=404, detail="班次不存在")
    if payload.code and payload.code != s.code and _shift_code_exists(db, user.tenant_id, payload.code):
        raise HTTPException(status_code=400, detail="班次编码已存在")
    start_t = time.fromisoformat(payload.start_time) if payload.start_time else None
    end_t = time.fromisoformat(payload.end_time) if payload.end_time else None
    update_shift(
        db,
        item=s,
        code=payload.code,
        name=payload.name,
        start_time=start_t,
        end_time=end_t,
        rest_minutes=payload.rest_minutes,
        shift_type=payload.shift_type,
        status=payload.status,
        remark=payload.remark,
    )
    db.commit()
    return ok({"id": s.id, "code": s.code, "name": s.name})


@router.delete("/{shift_id}")
def delete_shift_api(
    shift_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = get_shift_by_id(db, user.tenant_id, shift_id)
    if not s:
        raise HTTPException(status_code=404, detail="班次不存在")
    delete_shift(db, s)
    db.commit()
    return ok({"id": shift_id})


# ==================== 排班 ====================

@router.get("/schedules")
def list_schedules_api(
    user_id: int | None = Query(default=None),
    work_date: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items = list_shift_schedules(
        db,
        user.tenant_id,
        user_id=user_id,
        work_date=work_date,
        start_date=start_date,
        end_date=end_date,
    )
    shift_cache: dict[int, str] = {}
    user_cache: dict[int, str] = {}
    result = []
    for sc in items:
        if sc.shift_id not in shift_cache:
            sh = get_shift_by_id(db, user.tenant_id, sc.shift_id)
            shift_cache[sc.shift_id] = sh.name if sh else ""
        if sc.user_id not in user_cache:
            from app.models.user import User as UserModel
            u = db.get(UserModel, sc.user_id)
            user_cache[sc.user_id] = (u.full_name or u.username) if u else ""
        result.append({
            "id": sc.id,
            "user_id": sc.user_id,
            "shift_id": sc.shift_id,
            "work_date": sc.work_date,
            "remark": sc.remark,
            "created_at": sc.created_at,
            "updated_at": sc.updated_at,
            "shift_name": shift_cache[sc.shift_id],
            "user_name": user_cache[sc.user_id],
        })
    return ok({"items": result})


@router.post("/schedules")
def create_schedule_api(
    payload: ShiftScheduleCreateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = get_shift_by_id(db, user.tenant_id, payload.shift_id)
    if not s:
        raise HTTPException(status_code=400, detail="班次不存在")
    sc = create_shift_schedule(
        db,
        tenant_id=user.tenant_id,
        user_id=payload.user_id,
        shift_id=payload.shift_id,
        work_date=payload.work_date,
        remark=payload.remark,
    )
    db.commit()
    return ok({"id": sc.id, "user_id": sc.user_id, "shift_id": sc.shift_id, "work_date": sc.work_date})


@router.post("/schedules/batch")
def batch_create_schedules_api(
    payload: ShiftScheduleBatchCreateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = get_shift_by_id(db, user.tenant_id, payload.shift_id)
    if not s:
        raise HTTPException(status_code=400, detail="班次不存在")
    items = batch_create_shift_schedules(
        db,
        tenant_id=user.tenant_id,
        user_ids=payload.user_ids,
        shift_id=payload.shift_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.commit()
    return ok({"count": len(items)})


@router.delete("/schedules/{schedule_id}")
def delete_schedule_api(
    schedule_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sc = get_shift_schedule_by_id(db, user.tenant_id, schedule_id)
    if not sc:
        raise HTTPException(status_code=404, detail="排班记录不存在")
    delete_shift_schedule(db, sc)
    db.commit()
    return ok({"id": schedule_id})
