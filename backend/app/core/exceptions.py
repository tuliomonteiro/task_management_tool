"""Domain and application exceptions."""


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class NotFoundException(AppException):
    """Raised when an entity is not found."""


class TaskNotFoundException(NotFoundException):
    """Raised when a task is not found."""
