import unittest

class TestThis(unittest.TestCase):

    def test_this_please(self):
        self.assertEqual(2, 1+1, "Python should be capable of basic artihmetic!")

    def test_venv(self):
        import venv_exclusive
        self.assertEqual(3, venv_exclusive.venv_add(1, 2))
