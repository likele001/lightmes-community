from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "LightMes Backend"
    APP_ENV: str = "dev"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    DB_URL: str = "mysql+pymysql://root:root@127.0.0.1:3306/lightmes?charset=utf8mb4"
    DB_ECHO: bool = False
    DB_AUTO_CREATE: bool = True
    DB_AUTO_SEED: bool = True

    JWT_SECRET: str = "change_me"
    JWT_ALGORITHM: str = "HS256"
    # 未勾选「记住登录」：8 小时
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    # 勾选「记住登录」：7 天
    REMEMBER_ME_EXPIRE_MINUTES: int = 10080
    PUBLIC_BASE_URL: str = ""
    # 员工 H5 外网地址（用于任务标签二维码，如 https://h5.example.com）
    H5_PUBLIC_BASE_URL: str = ""

    STORAGE_DRIVER: str = "local"
    STORAGE_LOCAL_ROOT: str = "./data/storage"
    FILE_MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024
    FILE_ALLOWED_MIME: str = (
        "image/jpeg,image/png,image/webp,application/pdf,"
        "video/mp4,video/quicktime,video/webm,video/3gpp,video/x-msvideo"
    )

    REDIS_URL: str = "redis://127.0.0.1:6379/0"
    CELERY_BROKER_URL: str = "redis://127.0.0.1:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://127.0.0.1:6379/1"
    CELERY_TIMEZONE: str = "Asia/Shanghai"
    CELERY_ENABLE_UTC: bool = True

    CRM_PUBLIC_POOL_RECYCLE_HOUR: int = 2
    CRM_PUBLIC_POOL_RECYCLE_MINUTE: int = 0

    ALIYUN_OSS_ENDPOINT: str = ""
    ALIYUN_OSS_REGION: str = ""
    ALIYUN_OSS_BUCKET: str = ""
    ALIYUN_OSS_ACCESS_KEY_ID: str = ""
    ALIYUN_OSS_ACCESS_KEY_SECRET: str = ""

    TENCENT_COS_ENDPOINT: str = ""
    TENCENT_COS_REGION: str = ""
    TENCENT_COS_BUCKET: str = ""
    TENCENT_COS_SECRET_ID: str = ""
    TENCENT_COS_SECRET_KEY: str = ""

    QINIU_KODO_ENDPOINT: str = ""
    QINIU_KODO_REGION: str = ""
    QINIU_KODO_BUCKET: str = ""
    QINIU_KODO_ACCESS_KEY: str = ""
    QINIU_KODO_SECRET_KEY: str = ""

    AI_ENABLED: bool = False
    AI_BASE_URL: str = ""
    AI_API_KEY: str = ""
    AI_DEFAULT_MODEL: str = ""
    AI_TIMEOUT_SECONDS: int = 120


settings = Settings()
