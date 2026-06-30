class ResourceNotFoundError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)

class DemoSeedResetRequiredError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)
