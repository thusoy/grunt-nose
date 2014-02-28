import unittest

class ExclusionTest(unittest.TestCase):

    def test_exclude(self):
        self.assertEqual(1, 1, "I should not be run when excluding 'test_exclude")
