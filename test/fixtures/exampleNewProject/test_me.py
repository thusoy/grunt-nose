import unittest

class TestThis(unittest.TestCase):

    def test_this_please(self):
        self.assertEqual(2, 1+1, "Python should be capable of basic artihmetic!")
