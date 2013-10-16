import unittest

class VenvTest(unittest.TestCase):

    def test_venv_add(self):
        import venv_exclusive
        self.assertEqual(3, venv_exclusive.venv_add(1, 2))