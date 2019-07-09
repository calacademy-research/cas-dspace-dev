import tempfile
import shutil
import os

class TempStorage:

    def __init__(self, dir='.'):
        self.path = tempfile.mkdtemp() + '/'

    def remove_dir(self):
        return shutil.rmtree(self.path)

    def contents(self):
        result = []
        currentItems = os.listdir(self.path)

        for item in currentItems:
            if os.path.isdir(self.path+item):
                result += currentItems + [os.listdir(self.path+item)]
        return result
