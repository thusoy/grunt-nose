"""
  This module is by default *not* found by nose, because of the plural `tests` in the name.
"""

import unittest

class MoreGruntTests(unittest.TestCase):

    def passing(self):
        self.assertTrue(True, "This passes!")
