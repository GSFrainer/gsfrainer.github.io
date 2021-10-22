import threading

class Thread(threading.Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._return = None
    
    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)
        return

    def join(self, *args, **kwargs):
        super().join(*args, **kwargs)
        return self._return