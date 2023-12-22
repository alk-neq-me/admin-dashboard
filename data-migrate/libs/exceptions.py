class SerializeError(Exception):
    def __init__(self, message = "Serialize error found") -> None:
        self.message = message
        super().__init__(self.message)
