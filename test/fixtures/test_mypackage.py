import unittest
import my_package

class AddTest(unittest.TestCase):

    def test_add(self):
        self.assertEqual(my_package.add(1, 2), 3, "1 + 2 should be 3!")